// A function that we will later set up to call when a user is hovering with files over an area of the page.
function dropOver(evt){
	evt.stopPropagation();
	evt.preventDefault();
	dropZone.classList.add('drop');
	evt.target.classList.remove('loaded');
}
function dragOff(evt){
	dropZone.classList.remove('drop');
}


// Setup the dnd listeners.
var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', dropOver, false);
dropZone.addEventListener('dragout', dragOff, false);


function handleFileSelect(evt){

	dragOff(evt);

	var files;

	if(evt.dataTransfer && evt.dataTransfer.files) files = evt.dataTransfer.files; // FileList object.
	if(!files && evt.target && evt.target.files) files = evt.target.files;

	// files is a FileList of File objects. List some properties.
	var output = "";
	var reader,blob;
	
	// Build an array of file readers
	reader = new Array(files.length);

	for (var i = 0, f; i < files.length; i++) {
		f = files[i];

		reader[i] = new FileReader();

		// Closure to capture the file information.
		reader[i].onloadend = function(evt) {
			var result,i,lines,cols,data;

			if (evt.target.readyState == FileReader.DONE) { // DONE == 2
				if(stop > f.size - 1){
					var l = evt.target.result.regexLastIndexOf(/[\n\r]/);
					result = (l > 0) ? evt.target.result.slice(0,l) : evt.target.result;
				}else result = evt.target.result;


				// Do things with the result for this file
				// First we will use our helper function to parse the CSV content
				var csv = OI.CSV2JSON(result);
				
				console.log(csv);


			}
		};
		
		blob = f.slice(0,f.size);
		reader[i].readAsText(blob);

	}

	document.getElementById('drop_zone').classList.add('loaded');			

	return this;
}

document.getElementById('standard_files').addEventListener('change',function(evt){
	evt.stopPropagation();
	evt.preventDefault();
	return handleFileSelect(evt);
}, false);