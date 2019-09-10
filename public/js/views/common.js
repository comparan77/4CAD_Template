var commonViews = function() {}

commonViews.fillDropDown = function(data, idDdlControl, valueName, textName) {
    var $dropdown = $('#' + idDdlControl);
    $.each(data, (key,val) => $dropdown.append('<option value="' + val[valueName] + '">' + val[textName] + '</option>\n'));
}