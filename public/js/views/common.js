var commonViews = function() {}

commonViews.fillDropDown = function(data, idDdlControl, valueName, textName) {
    var $dropdown = $('#' + idDdlControl);
    $.each(data, (key,val) => $dropdown.append('<option value="' + val[valueName] + '">' + val[textName] + '</option>\n'));
}

commonViews.clearFileInput = function(id) { 
    var oldInput = document.getElementById(id); 

    var newInput = document.createElement("input"); 

    newInput.type = "file"; 
    newInput.id = oldInput.id; 
    newInput.name = oldInput.name; 
    newInput.className = oldInput.className; 
    newInput.style.cssText = oldInput.style.cssText; 
    // TODO: copy any other relevant attributes 
    newInput.setAttribute("accept", oldInput.getAttribute("accept"));

    oldInput.parentNode.replaceChild(newInput, oldInput); 
}