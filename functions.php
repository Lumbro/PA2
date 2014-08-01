<?php
@session_start();
function cleanforbiddenall($dir)
{
@chmod(dirname($dir), 0777);
@chmod($dir, 0777);
cleanforbidden($dir);
@chmod(dirname($dir), 0755);
}
function cleanforbidden($dir)
{
global $cfg;
$dir = rtrim($dir,"/");
$mydir = opendir($dir);
while(false !== ($file = readdir($mydir))){
	if($file != "." && $file != ".."){
	@chmod($dir."/".$file, 0777);
	if(is_dir($dir."/".$file)){
		chdir('.');
		cleanforbidden($dir."/".$file);
	}
	else{
		$fn = $dir."/".$file;
		$tt = getMIMEType($fn);
		if(in_array($tt->extension, $cfg->forbidden_extension)){
			@unlink($fn);
		}
	}
	}
}
closedir($mydir);
}

function destroyall($dir)
{
@chmod(dirname($dir), 0777);
@chmod($dir, 0777);
destroy($dir);
@rmdir($dir);
@chmod(dirname($dir), 0755);
}
function destroy($dir)
{
	$dir = rtrim($dir,"/");
	$mydir = opendir($dir);
	while(false !== ($file = readdir($mydir))) 
	{
		if($file != "." && $file != "..") 
		{
			@chmod($dir."/".$file, 0777);
			if(is_dir($dir."/".$file)) 
			{
				chdir('.');
				destroy($dir."/".$file);
				rmdir($dir."/".$file) or DIE("couldn't delete $dir$/file<br />");
			}
			else
			@unlink($dir."/".$file) or DIE("couldn't delete $dir$/file<br />");
		}
	}
	closedir($mydir);
}

function ls_a($wh)
{
	$files = "";
	if($handle=opendir($wh)) 
	{
		while (false!== ($file = readdir($handle))) 
		{
			if ($file!= "." && $file!= ".." ) 
			{
				if(empty($files)) 
					$files="$file";
				else 
					$files="$file\n$files";
			}
		}
		closedir($handle);
	}
	$arr=explode("\n",$files);
	return $arr;
}

function getMIMEType($filename){
$obj = new StdClass();
$arr = array(
'3gp'=>'3GP File',
'mp4'=>'MP4 Video',
'wma'=>'WMA File',
'*'=>'Octet-stream',
'avi'=>'Video Clip',
'bin'=>'BIN File',
'bmp'=>'BMP File',
'class'=>'CLASS File',
'conf'=>'CONF File',
'ini'=>'Configuration Settings',
'css'=>'Cascading Style Sheet Document',
'dll'=>'DLL File',
'doc'=>'MS. Word 97-2003 Document',
'docx'=>'MS. Word Document',
'exe'=>'Application',
'flv'=>'FLV File',
'gif'=>'GIF Image',
'gtar'=>'WinRAR Archive',
'gz'=>'WinRAR Archive',
'htm'=>'HTML Document',
'html'=>'HTML Document',
'ico'=>'Icon',
'jpe'=>'JPEG Image',
'jpeg'=>'JPEG Image',
'jpg'=>'JPEG Image',
'js'=>'JScript Script File',
'mdb'=>'MS. Access Database',
'movie'=>'Movie File',
'mp3'=>'MP3 Format Sound',
'mpe'=>'Movie Clip',
'mpeg'=>'Movie Clip',
'mpg'=>'Movie Clip',
'wmv'=>'WMV Video',
'mkv'=>'MKV File',
'pdf'=>'Adobe Acrobat Document',
'php'=>'PHP Script',
'png'=>'PNG Image',
'pps'=>'MS. Powerpoint 97-2003 Slide show',
'ppt'=>'MS. Powerpoint 97-2003 Persentation',
'pptx'=>'MS. Powerpoint Persentation',
'rtf'=>'Rich Text Format',
'swf'=>'SWF File',
'sql'=>'SQL File',
'tar'=>'WinRAR Archive',
'tgz'=>'WinRAR Archive',
'txt'=>'Text Document',
'wav'=>'Wave Sound',
'xls'=>'MS. Excel 97-2003 Worksheet',
'xlsx'=>'MS. Excel Worksheet',
'z'=>'WinRAR Archive',
'zip'=>'application/zip');

$ext = '';
$mime = '';

$filename2 = strrev(strtolower($filename));

foreach($arr as $key=>$val)
{
	$ext2 = strrev($key).'.';
	$pos = stripos($filename2, $ext2);
	if($pos === 0)
	{
		$ext = $key;
		$mime = $val;
		break;
	}
}
if(!$ext)
{
	$arr2 = explode(".", $filename);
	$ext = $arr2[count($arr2)-1];
}
$obj->extension = $ext;
$obj->mime = $mime;
return $obj;
}

function path_encode($dir, $root=NULL){
if($root===NULL){
global $cfg;
$rootdir = $cfg->rootdir;
}
else{
$rootdir = $root;
}
$dir = rtrim(str_replace(array("/..","../","./","..\\",".\\","\\","//"),"/",$dir),"/\\");
$rootdir = trim(str_replace(array("/..","../","./","..\\",".\\","\\","//"),"/",$rootdir),"/\\");
$dir2 = trim(str_replace($rootdir, 'base', $dir),"/");
$dir2 = str_replace("//","/",$dir2);
return $dir2;
}
function path_decode($dir, $root=NULL){
if($root===NULL){
global $cfg;
$rootdir = $cfg->rootdir;
}
else{
$rootdir = $root;
}
$dir2 = $dir;
if(substr($dir2,0,4)=="base")
{
$dir2 = substr($dir2,4);
}
$dir2 = rtrim($dir2,"/\\");
$rootdir = rtrim($rootdir,"/\\");
$dir2 = str_replace(array("\\..","/.."),"/",$dir2);
$dir2 = str_replace("\\", "/", $dir2);
$dir2 = str_replace("//", "/", $dir2);
$dir2 = str_replace("//", "/", $dir2);
$dir2 = str_replace("../", "/", $dir2);
$dir2 = str_replace("//", "/", $dir2);
$dir2 = $rootdir."/".$dir2;
$dir2 = rtrim($dir2,"/\\");
return $dir2;
}

function path_decode_to_url($dir,$rooturl=""){
$dir2 = $dir;
if(substr($dir2,0,4)=="base")
{
$dir2 = substr($dir2,4);
}
$dir2 = rtrim($dir2,"/\\");
$dir2 = $rooturl."/".$dir2;
$dir2 = rtrim($dir2,"/\\");
return $dir2;
}


function path_encode_trash($dir, $trash=NULL){
if($trash===NULL){
global $cfg;
$trashdir = $cfg->trashdir;
}
else{
$trashdir = $trash;
}
$dir = rtrim(str_replace(array("/..","../","./","..\\",".\\","\\","//"),"/",$dir),"/\\");
$trashdir = rtrim(str_replace(array("/..","../","./","..\\",".\\","\\","//"),"/",$trashdir),"/\\");
$dir2 = trim(str_replace($trashdir, 'base', $dir),"/");
return $dir2;
}
function path_decode_trash($dir, $trash=NULL){
if($trash===NULL){
global $cfg;
$trashdir = $cfg->trashdir;
}
else{
$trashdir = $trash;
}
$dir2 = $dir;
if(substr($dir2,0,4)=="base")
{
$dir2 = substr($dir2,4);
}
$dir2 = rtrim($dir2,"/\\");
$trashdir = rtrim($trashdir,"/\\");
$dir2 = str_replace(array("/..","../","./","..\\",".\\","\\","//"),"/",$dir2);
$dir2 = $trashdir."/".$dir2;
$dir2 = rtrim($dir2,"/\\");
return $dir2;
}

$file_list = '';
function dir_list($dir){
global $file_list;
$dh=opendir($dir);
if($dh){
while($subitem=readdir($dh)){
if(preg_match('/^\.\.?$/',$subitem)) 
continue;
if(is_file($dir."/".$subitem))
$file_list .= "$dir/$subitem\r\n";
if( is_dir("$dir/$subitem") )
dir_list("$dir/$subitem");
}
closedir($dh);
}
}

function deleteforbidden($dir, $containsubdir=false){
global $cfg;
if($cfg->delete_forbidden_extension && file_exists($dir) && is_array($cfg->forbidden_extension))
{
	if($containsubdir){
		cleanforbiddenall($dir);
	}
	else
	{
	$dh=opendir($dir);
	if($dh){
	while($subitem=readdir($dh)){
		$fn = "$dir/$subitem";
		if($subitem == "." || $subitem == ".." ){
		continue;
		}
		$filetype = filetype($fn);
		if($filetype=="file"){
		$tt = getMIMEType($fn);
		if(in_array($tt->extension, $cfg->forbidden_extension)){
			@unlink($fn);
		}
		}
	}
	closedir($dh);
	}
}
}
}
function dmstoreal($deg, $min, $sec){
return $deg + ((($min*60)+($sec))/3600);
}

function real2dms($val){
$tm = $val * 3600;
$tm = round($tm);
$h = sprintf("%02d",date("H",$tm)-7);
if($h<0) $h+=24;
$m = date("i",$tm);
$s = date("s",$tm);
return array($h,$m,$s);
}

function builddirtree($dir){
$dir = str_replace("\\", "/", $dir);
$arr = explode("/", $dir);
$ret = "%s";
$dt = array();
$dt['path'] = "";
$dt['name'] = "";
$dt['location'] = "";
foreach($arr as $k=>$val){
	$dt['path'] = $dt['path'].$val;
	$dt['name'] = basename($val);
	$dt['location'] = $dt['location'].($val);
	if($k>1){
	$html = "<ul>\r\n";
	$html .= "<li class=\"row-data-dir dir-control\" data-file-name=\"".$dt['name']."\" data-file-location=\"".$dt['location']."\"><a href=\"javascript:;\" onClick=\"return openDir('".$dt['path']."')\">".$dt['name']."</a>";
	$html .= "%s</li>\r\n";
	$html .= "</ul>";
	$ret2 = sprintf($ret, $html);
	$ret = $ret2;
	}
	$dt['path'] = $dt['path']."/";
	$dt['name'] = $dt['name']."/";
	$dt['location'] = $dt['location']."/";
}
$ret = str_replace("%s","",$ret);
return $ret;
}
?>