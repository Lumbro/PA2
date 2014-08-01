<?php
include_once dirname(__FILE__)."/functions.php";
include dirname(__FILE__)."/conf.php";
$dir = trim(stripslashes(@$_GET['dir']),"/");
if(!is_dir(path_decode($dir, $cfg->rootdir))){
$dir = '';	
}
if(!$dir) $dir =  'base';
?><!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>File Manager</title>
<link rel="shortcut icon" href="style/images/Setting-icon.png" type="image/jpeg" />
<link rel="stylesheet" type="text/css" href="style/file-type.css" />
<link rel="stylesheet" type="text/css" href="style/style.css" />
<link rel="stylesheet" href="script/jquery/pw/jquery.ui.core.css">
<link rel="stylesheet" href="script/jquery/pw/jquery.ui.theme.css">
<link rel="stylesheet" href="script/jquery/pw/jquery.ui.resizable.css" />
<link rel="stylesheet" href="script/jquery/pw/jquery.ui.positioning.css" />
<link rel="stylesheet" href="script/jquery/pw/jquery.ui.dialog.css">
<script language="javascript" src="script/script.js"></script>
<script language="javascript" src="script/jquery/jquery.min.js"></script>
<script language="javascript" src="script/jquery/jquery-ui-1.8.21.custom.min.js"></script>
<script language="javascript" src="script/overlay-dialog.js"></script>
<script language="javascript">
window.onload = function(){
initContextMenuFile();
initContextMenuDir();
initContextMenuFileArea();
setCheckRelation();
setSize();
initDropable();
$(window).resize(function(){setSize();});
loadAnimationStop();
}
function selectFileIndex(url){
	window.open(url);
}
function url2path(url)
{
	var rooturl = '<?php echo $cfg->rooturl;?>';
	var path = url;
	if(rooturl.length>1)
	{
		path = path.substr(rooturl.length+1);
	}
	return 'base/'+path;
}
</script>
<body>
<div id="all">
<div id="wrapper">
<div class="toolbar">
<div id="anim-loader" class="anim-active"></div>
  <ul>
    <li><a href="javascript:uploadFile()" title="Upload File"><img src="style/images/upload.gif" alt="Upload" /></a></li>
	<li><a href="javascript:compressSelectedFile()" title="Compress Selected File"><img src="style/images/compress.gif" alt="Compress" /></a></li>
    <li><a href="javascript:extractFile()" title="Extract First Selected File"><img src="style/images/extract.gif" alt="Extract" /></a></li>
    
  </ul>
</div>

<div class="addressbar">
<form name="dirform" method="get" enctype="multipart/form-data" action="" onSubmit="return openDir()">
<input type="text" class="input-text address" name="address" id="address" value="<?php echo $dir;?>" autocomplete="off" /> <input type="submit" name="opendir" id="opendir" class="com-button" value="Open" />
</form>
</div>

<div class="middle">
	<div class="directory-area">
    	<div id="directory-container">
            <ul>
            <li class="basedir dir-control" data-file-name="base" data-file-location="">
            <a href="javascript:;" onClick="return openDir('base')">base</a>
			  <?php 
              include_once dirname(__FILE__)."/tool-load-dir.php";
              ?>
            </li>
            </ul>
    	</div>
    </div>
    
    <div class="file-area">
    	<div id="file-container">
    	  <?php 
		  include_once dirname(__FILE__)."/tool-load-file.php";
		  ?>
    	</div>
    </div>
    
</div>
</div>
</div>

<div style="display:none">
<div id="common-dialog" title="">
<div id="common-dialog-inner">
</div>
</div>
</div>
<div id="overlay-container" style="display:none"></div>
</body>
</html>