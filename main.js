define(function(require, exports, module) {
	exports.editorDidLoad = function editorDidLoad(editor) {
		
	    editor.treeController.addCommand('align', 'Align selection based on pipe (|) chars', function(treeController) {
		    alignSelection(treeController, '|');
	    });
		

	    function StringBuilder() {
		  this._array = [];
		    this._index = 0;
	    }

	    // StringBuilder below is from: http://stackoverflow.com/a/4717855/707120
	    StringBuilder.prototype.length = function () {
		return this._array.length
	    }

	    StringBuilder.prototype.append = function (str) {
		    this._array[this._index] = str;
			this._index++;
	    }

	    StringBuilder.prototype.toString = function () {
		  return this._array.join('');
	    }

	    function alignLines(nodes, alignChar ) {

		// establish column lengths
		var columnWidth = new Array();
		for ( i = 0; i < nodes.length; i++ ) {
		    var ialignChar = 0;
		    var text = nodes[i];

		    for ( j = 0; j < text.length; j++ ) {
			if ( text[j] == alignChar ) {
			    if ( columnWidth.length <= ialignChar || columnWidth[ialignChar] < j ) {
				columnWidth[ialignChar] = j;
			    }
			    ialignChar++;
			} else {
			    console.log( "failed to match ".concat( text[j], " with ", alignChar ) )
			}

		    }
		}


		console.log( "columnWidth.length(".concat( columnWidth.length, ")") )
		for ( i = 0; i < columnWidth.length; ++i ) {
		    console.log( "columnWidth[".concat(i, "]=", columnWidth[i] ) )
		}

		// align the text
		var newLines = new Array();
		for ( i = 0; i < nodes.length; i++ ) {
		    var ialignChar = 0;
		    var inewText = 0;
		    var text = nodes[i];
		    var newText = new StringBuilder();

		    console.log("text=".concat(text) )

		    // transcribe the text
		    for ( j = 0; j < text.length; j++ ) {
			if ( text[j] == alignChar ) {
			    var padlen = columnWidth[ialignChar] - newText.length();
			    for ( k = 0; k < padlen; k++ ) {
				newText.append(" ");
			    }
			    newText.append(text[j])	// forward the alignChar
			    ialignChar++;
			} else {
			    newText.append(text[j]);
			}
		    }
			
		    newLines.push(newText.toString());
		}
		return newLines;
	    }

			
	    function alignSelection(treeController, alignChar) {
		    var treeModel = treeController.treeModel,
			    undoManager = treeController.undoManager,
			    selectedRange = treeController.treeView.selectedRange();
										    
		    undoManager.beginUndoGrouping();
		    treeModel.beginUpdates();
		    
		    var nodes = selectedRange.nodesInRange();
		    var newText = alignLines( nodes.map( function(x) { return x.text() } ), alignChar )
		    console.log("nodes[0].text=".concat(nodes[0].text()))
		    console.log("X".concat("Y"))

		    console.log(newText.length)
		    console.log(newText[0])

		    for ( i = 0; i < nodes.length; i++ ) {
			nodes[i].setText( newText[i] )
		    }


		    treeModel.endUpdates();
		    undoManager.endUndoGrouping();
		    undoManager.setActionName("Align");
	    }
    };
});
