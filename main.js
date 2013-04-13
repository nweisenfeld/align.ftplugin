define(function(require, exports, module) {
	exports.editorDidLoad = function editorDidLoad(editor) {
		
	    editor.treeController.addCommand('align', 'Align selection based on pipe (|) chars', function(treeController) {
		    alignSelection(treeController, '|');
	    });
		
	    
	    // StringBuilder below thanks to: http://stackoverflow.com/a/4717855/707120
	    function StringBuilder() {
		  this._array = [];
		    this._index = 0;
	    }

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
		    var lengths = nodes[i].split( alignChar ).map( function (d) { return d.length } )

		    for ( j = 0; j < lengths.length; j++ )
			if ( j >= columnWidth.length || lengths[j] > columnWidth[j] )
			    columnWidth[j] = lengths[j]
		}

		// align the text
		var newLines = new Array();
		for ( i = 0; i < nodes.length; i++ ) {
		    var newText = new StringBuilder();
		    var text = nodes[i].split(alignChar)

		    // transcribe the text
		    for ( j = 0; j < text.length; j++ ) {
			var pad = columnWidth[j]  - text[j].length
			newText.append( text[j] )
			if ( pad > 0 ) { newText.append( Array( pad+1 ).join(" ") ) }
			if ( j < text.length-1 ) { newText.append( alignChar ) }
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

		    for ( i = 0; i < nodes.length; i++ ) {
			nodes[i].setText( newText[i] )
		    }

		    treeModel.endUpdates();
		    undoManager.endUndoGrouping();
		    undoManager.setActionName("Align");
	    }
    };
});
