<?php
$cfg = new StdClass();

$cfg->authentification_needed = false;		/* When Kams File Manager is used on online system, it must be set true.*/
$cfg->rootdir = dirname(__FILE__)."/data";	/* Root directory for uploaded file. Use .htaccess file to protect this directory from executing PHP files.*/
$cfg->rooturl = "data";						/* Root url for uploaded file. It can be relative or absoulute.*/
$cfg->thumbnail = true;						/* Thumbnail for image files.*/
$cfg->thumbnail_quality = 75;				/* Quality for thumbnail image.*/
$cfg->thumbnail_max_size = 50000000; 		/* Maximum file size to show with thumbnail */
$cfg->readonly = false;						/* Is user allowed to modify the file or the directory including upload, delete, or extract files.*/
$cfg->allow_upload_all_file = true;			/* Is user allowed to upload file beside image.*/
$cfg->allow_upload_image = true;			/* Is user allowed to upload images.*/
$cfg->delete_forbidden_extension = true;	/* Delete forbidden files on upload, rename, copy, or extract operation */
$cfg->forbidden_extension = array('exe', 'php', 'pl', 'htaccess', 'ini', 'js');

/* Note
   You can permit user to upload images but not other type for security reason.
   You can add .htaccess file to prevent user executing PHP scripts but its location is not on {$cfg->rootdir}
   
   For example:
   Your root document of your system is
   /home/youname/public_html
   
   You set upload directory to
   /home/yourname/public_html/upload
   
   You can place an .htaccess file in
   /home/youname/public_html
   to redirect client access   
*/
?>