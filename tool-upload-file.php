<?php
$file_name = $_FILES['file_zip']['name'];
$size = $_FILES['file_zip']['size'];
$file_type = $_FILES['file_zip']['type'];
$file_zip = $_FILES['file_zip']['tmp_name'];
$direktori = "data/public_html/upload/$file_name";
$zip = new ZipArchive;
if ($file_zip == ""){
	echo ("<script>alert('no file selected.');document.location='/PA2/'</script>");
}
	
else if ( file_exists ($direktori)) {
	echo ("<script>alert('file $file_name is ready exists.');document.location='/PA2/'</script>");
	
}
else if ($zip->open($file_zip) === TRUE) {
	$zip->extractTo($direktori);
	$zip->close();
	echo ("<script>alert('File has been uploaded and extract.');document.location='/PA2/'</script>");
	
} 
else {
	move_uploaded_file($file_zip,$direktori);
	echo ("<script>alert('File has been uploaded.');document.location='/PA2/'</script>");
}
?>
