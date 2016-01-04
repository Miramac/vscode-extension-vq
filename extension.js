
var vscode = require('vscode');
var spawn = require('child_process').spawn;
var fs = require('fs');
var process = require('process');
var path = require('path');
var chalk = require('chalk') 

function activate(context) {
    var task;
    var outputChannel = vscode.window.createOutputChannel('vocQuery');
    var runningStatus = null;
    
    var run = vscode.commands.registerCommand('vocatus.vq.run', function () {

        if(runningStatus) {
           vscode.window.showErrorMessage('vocQuery is already running!');
           return;
        } 
        runningStatus =  vscode.window.setStatusBarMessage('Running...')

        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }
        if(editor._document._languageId === 'Log') {
            editor = vscode.window.visibleTextEditors[0];
        }
        var selection = editor.selection;
        var text = editor.document.getText(selection);
        
        if(text === '') {
            text = editor.document.getText();
        } 
        
        var tmpFile = path.join(process.env.temp,`_${Math.random()}.tmp`);
        
        outputChannel.show(2);
        outputChannel.appendLine('Debug: Start process');
                outputChannel.appendLine()
                
        text = `require('process').chdir('${path.dirname(editor.document.fileName).replace('\\','\\\\')}');\n${text}`;
        fs.writeFileSync(tmpFile, text);
        
        task = spawn('node', [tmpFile]);
        
        task.stdout.on('data', function(data) {
            outputChannel.append(data.toString());
        });
        task.stderr.on('data', function(data) {
            outputChannel.appendLine('Error: ');
            outputChannel.appendLine(data.toString());
        }); 
        task.on('close', function() {
            fs.unlink(tmpFile);
            outputChannel.appendLine('\nDebug: End process');
            runningStatus.dispose();
            runningStatus = null;
        });

	});
	
    
    var cancel = vscode.commands.registerCommand('vocatus.vq.cancel', function () {
        if(runningStatus) {
            vscode.window.showWarningMessage('Process canceled!');
            task.kill();
        }
    });
    
	context.subscriptions.push(run, cancel);
}
exports.activate = activate;
