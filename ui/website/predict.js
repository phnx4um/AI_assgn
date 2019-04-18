

$("#image-selector").change(function () {
    let reader = new FileReader();
    reader.onload = function () {
        let dataURL = reader.result;
        $("#selected-image").attr("src", dataURL);
        $("#prediction-list").empty();
	$("#rec").empty();
    }
    let file = $("#image-selector").prop("files")[0];
    reader.readAsDataURL(file);
}); 


let model;
(async function () {
    model = await tf.loadModel("http://127.0.0.1:3000/keras_model/model.json", {mode: 'no-cors'});
    $(".progress-bar").hide();
    console.log("MODEL LOADED");
})();


function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}


$("#predict-button").click(async function (){
	//get selected image 
	let image = $("#selected-image").get(0);

	//convert the image into required format for feeding into the neural network
	//for prediction
	let imageTensor = tf.fromPixels(image)
		.resizeNearestNeighbor([50,50])
		.mean(2)
		.toInt()
		.expandDims(2)
		.expandDims();
	
	// predict the result
	let predictions = await model.predict(imageTensor).data();
	console.log(typeof(predictions));
	console.log(predictions);
	let predArr = Array.from(predictions);
	console.log(typeof(predictions));
	console.log(predArr);
	
	//create a new array
	let cateArr = ["square", "oval", "heart", "round", "oblong"];
	
	let hairArr = ["Side Swept with Part, Comb Over, Undercut, Popmpadour with Fade and Beard, Fade, Slicked Back Undercut, Side Part",
		       "quiff, pompadour, faux hawk, brush back",
		       "more volume is better; try a quiff, pompadour, brush up, faux hawk or spiky hair",
		       "flattering, spiky hair, faux hawk, French crop, pompadour, quiff, slicked back undercut",
		       "crew cut, buzz cut, fade or undercut on the sides with a comb over, side part, slicked back or textured French crop"
		       ]
	
	//predArr.forEach(function (p) {
	//	$('#prediction-list').append(`<li>${p}</li>`);	
	//});
		
	for (var i=0; i<cateArr.length; i++){
		$('#prediction-list')
			.append(`<li><h4>${cateArr[i]}: ${predArr[i]} (${predArr[i]*100} %)<h4></li>`);
	}
	//model.summary();
		
	let maxInd = indexOfMax(predArr);
	console.log(maxInd);
	
	
	$('#rec').append(`<li><h4>${hairArr[maxInd]}</h4></li>`);	
		

});




