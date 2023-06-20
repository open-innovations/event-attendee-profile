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

	var files,csv,selector;

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
				csv = OI.CSV2JSON(result);
				
				console.log(csv);

				// Try to detect an email column
				var eindex = -1;
				for(i = 0; i < csv.names.length; i++){
					if(csv.names[i].match(/email/i)){
						eindex = i;
						continue;
					}
				}
				

				// Create a drop down
				selector = document.createElement('select');
				for(i = 0; i < csv.names.length; i++){
					var item = document.createElement('option');
					item.innerHTML = csv.names[i];
					if(eindex == i){
						item.setAttribute('selected','selected');
					}
					selector.appendChild(item);
				}

				// Add selector to the page
				document.getElementById('drop_zone').after(selector);

				// Add an event to the selector
				selector.addEventListener('change',function(e){

					processData();
					
				});
				
				// If we have an email column then do things
				if(eindex >= 0){

					processData();					
					
				}else{
					console.error('No column named "Email" found.');
				}


			}
		};
		
		blob = f.slice(0,f.size);
		reader[i].readAsText(blob);

	}

	document.getElementById('drop_zone').classList.add('loaded');			

	function processData(){
		console.log('processData',csv,selector.value);
		
		// Do stuff to check emails
		
		// Write output to page
		
		
	}

	return this;
}


document.getElementById('standard_files').addEventListener('change',function(evt){
	evt.stopPropagation();
	evt.preventDefault();
	return handleFileSelect(evt);
}, false);