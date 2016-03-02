$(function(){
  $('[data-toggle="tooltip"]').tooltip();
  // Created vars to hold the initial values coming in from the DOM
  var item_colors = [];
  var item_sizes = [];
  var dropDownSizes = [];
  
  // iterating through the table tr td's to retrieve each color and size
  $('#mytable tr').each(function() {
     //pushing the found values into an array
    item_colors.push($(this).find("#item_color").html());
    item_sizes.push($(this).find("#item_size").html());
  });

  // deleting the first null index in both arrays
  item_colors.shift();
  item_sizes.shift();

  // iterating through the item_colors array
  for(var i = 0; i < item_colors.length; i++){
    
    // splitting the 1 string index into seperate index's
    var res = item_sizes[i].split(",");

    // creating the object key value pairs for each
    dropDownSizes[i] = {
      item_color: item_colors[i], //first index in object array will be each color and ....
      item_sizes: res             //the corresponding sizes array as the second index
    };  
  }
  
  //This is where we place the cooresponding sizes when a selection is made in the color dropdown on change event
  $("#color-drop").change(function(e) {

    var chosenCol = $(this).val(); //selected value instance
    var count = 0; //loop count tracker
    
    // iterate through the object array
    dropDownSizes.forEach(function (item){

      //if chosenColor matches any color in the object array, then proceed
      if(chosenCol === item.item_color){
        // Empty out the size-drop options
        $('#size-drop').empty();

        // iterate through the sizes array
        for(var i = 0; i < item.item_sizes.length; i++){
          // Append each array index as an option into the size-drop dropdown
          $('#size-drop').append("<option value=" + item.item_sizes[i] + ">" + item.item_sizes[i] + "</option>");
        }
      }
    });
  });

  
  $('.ui.accordion').accordion('behavior', 'open', 'close');
});