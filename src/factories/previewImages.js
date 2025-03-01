angular.module('myApp').factory('previewImages', function($timeout) {
   return {
    previewImages : function (input) {
        let images = [];
        if (input.files) {
          let files = Array.from(input.files); // Convert FileList to an array
          let totalFiles = files.length;
          let processedFiles = 0;
      
          files.forEach((file) => {
            let reader = new FileReader(); // making new instance of FileReader
            reader.readAsDataURL(file); // read the file as data url which means converting it basically into the base64 format
            
            reader.onload = function (e) {  // onload event is triggered when the file is read
           
             images.push({ file: file, base64: e.target.result }); // pushing the file and the base64 data into the images array
              processedFiles++;
      
          
              console.log("Image added:", file.name);
      
              
              if (processedFiles === totalFiles) { // if all the files are processed then log the images array
                console.log("All images processed:", images);
              }
      

              $timeout(); // timeout is used to update the view
            };
          });
        }
        return images.map(image => image.base64); // return the images array after filtering out the images which are not base64
   } 
   }
});