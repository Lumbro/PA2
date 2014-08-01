var angle = 0;
var fliph = 0;
var flipv = 0;
var resize = 0;
var imgwidth = 1;
var imgheight = 1;
var crop = 0;
var filepath = '';
var fileurl = '';
function addslashes(input){
var searchStr = "\'";
var replaceStr = "\\'";
var re = new RegExp(searchStr , "g");
var output = input.replace(re, replaceStr);
return output;
}
function inArray(needle,haystack){
var i;
for(i in haystack){if(needle==haystack[i]){return true;}}
return false;
}
function basename(path){
return path.replace(/\\/g,'/').replace(/.*\//,'');
}
function dirname(path){
return path.replace(/\\/g,'/').replace(/\/[^\/]*$/,'');
}
function getfileextension(filename){
return (/[.]/.exec(filename))?/[^.]+$/.exec(filename):'';
}
function removefileextension(filename){
return filename.replace(/\.[^/.]+$/,'');
}
function setCheckRelation(){
$('.checkbox-selector').live('change',function(){
var id=$(this).attr('id');
var classname=id.substring(8);
var checked=$(this).attr('checked');
if(checked=='checked'){
$('.'+classname).attr('checked','checked');
}
else{
$('.'+classname).removeAttr('checked');
}
});
}
function jqAlert(msg, title, width, height)
{
	$('#message-box-dialog').remove();
	$('body').append('<div id="message-box-dialog"><div id="message-box-dialog-inner"></div></div>');
	if(!title) title = 'Alert';
	if(!width) width = 300;
	if(!height) height = 160;
	$('#message-box-dialog').dialog('destroy');
	$('#message-box-dialog').attr('title', title);
	$('#message-box-dialog-inner').html(msg);
	$('#message-box-dialog').dialog({
	width:width,
	height:height,
	modal:true,
	buttons:{
	'Close':function(){
		$('#message-box-dialog').dialog('destroy');
	}
	}
	});
}
function checkForm(frm){
var formid=$(frm).attr('id');
if(!formid || formid=='')
{
	formid='form'+Math.round(Math.random()*10000);
	$(frm).attr('id',formid);
}
var needed=0;
var inputid='';
$('#'+formid+' :input').each(function(index){
if($(this).attr('data-needed')=='true'&&!$(this).val())
{
needed++;
if(inputid=='') inputid=$(this).attr('id');
}
if($(this).attr('data-needed')=='true'&&$(this).attr('data-type')=='email'&&!isValidEmail($(this).val()))
{
needed++;
if(inputid=='') inputid=$(this).attr('id');
}
});
if(needed>0){
$('#'+inputid).focus();
return false;
}
return true;
}

function contextMenu(selector, menu){
$(selector).bind('contextmenu',function(e){
	e.preventDefault();
	var left = parseInt(e.clientX);
	var top  = e.clientY;
	var html;
	var scrllf = $(document).scrollLeft();
	var scrltp = $(document).scrollTop();
	left = parseInt(left)+parseInt(scrllf);
	top = parseInt(top)+parseInt(scrltp);
	var width = parseInt($(window).width());
	var height = parseInt($(window).height());
	$('.context-menu').remove();
	html = '<div class="context-menu"></div>';
	$('body').append(html);
	html = '<ul>';
	for(var i in menu)
	{
		var classname = menu[i]['classname'];
		html += '<li class="file-function file-function-'+classname+'"><a href="'+menu[i]['linkurl']+'">'+menu[i]['caption']+'</a></li>';
	}
	html += '</ul>';
	$('.context-menu').html(html);
	$('.context-menu').css({'display':'none','left':left+'px','top':top+'px'});
	var cmwidth = parseInt($('.context-menu').width());
	var cmheight = parseInt($('.context-menu').height());
	if((cmwidth + left + 16) >= width)
	{
		left = left - cmwidth;
		$('.context-menu').css({'left':left+'px','top':top+'px'});
	}
	if((cmheight + top + 20) >= height)
	{
		top = height - parseInt(cmheight) - 20;
		$('.context-menu').css({'left':left+'px','top':top+'px'});
	}
	$('.context-menu').fadeIn(300);
	$(document).bind('click',function(){
	$('.context-menu').remove();
	});
	$(document).keydown(function(event){if((event.keyCode&&event.keyCode===$.ui.keyCode.ESCAPE)){$('.context-menu').remove();}});
	return false;
});
}

function setSize(){
var wh = parseInt($(window).height());
var ww = parseInt($(window).width());
$('.directory-area, .file-area').css('height', (wh-85)+'px');
$('.address').css('width', (ww-120)+'px');
}

function initContextMenuFileArea(){
var cm = [
{'caption':'Compress Selected File', 'linkurl':'javascript:compressSelectedFile()', 'classname':'compress'},
];
contextMenu('.file-area', cm);
}

function initContextMenuFile(){
$('.row-data-file').each(function(index){
var filetype = $(this).attr('data-file-type');
var filename = $(this).attr('data-file-name');
var filelocation = $(this).attr('data-file-location');
var filepath = filelocation+'/'+filename;
var fileurl = $(this).attr('data-file-url');
var selfurl = $(this).attr('data-file-url');
if(filetype.indexOf('image')!=-1 || filetype.indexOf('shockwave')!=-1)
{
	var width = $(this).attr('data-image-width');
	var height = $(this).attr('data-image-height');	
	attr = {'width':width, 'height':height};
	contextMenu(this, contextMenuListFile(filetype, filepath, fileurl, attr));
}
else
{
contextMenu(this, contextMenuListFile(filetype, filepath, fileurl));
}
});
}

function initContextMenuDir(){
$('.row-data-dir').each(function(index){
var filetype = $(this).attr('data-file-type');
var filename = $(this).attr('data-file-name');
var filelocation = $(this).attr('data-file-location');
var filepath = filelocation+'/'+filename;
contextMenu(this, contextMenuListDir(filepath));
});
}

function contextMenuListFile(filetype, filepath, fileurl, attr){
	filepath = addslashes(filepath);
	fileurl = addslashes(fileurl);
	var width = '0';
	var height = '0';
	var cm = new Array();
	if(filetype.indexOf('image')==0)
	{
		width = parseInt(attr['width']);
		height = parseInt(attr['height']);
		cm = [
		{'caption':'Preview Image',				'linkurl':'javascript:previewFile(\''+fileurl+'\', '+width+', '+height+')',	'classname':'preview'},
		{'caption':'Compress File',				'linkurl':'javascript:compressFile(\''+filepath+'\')',	'classname':'compress'},
		];
	}
	else if(filetype.indexOf('video')==0)
	{
		cm = [
		{'caption':'Open File',					'linkurl':'javascript:selectFile(\''+fileurl+'\')',		'classname':'select'},
		{'caption':'Compress File',				'linkurl':'javascript:compressFile(\''+filepath+'\')',	'classname':'compress'},
		];
	}
	else if(filetype.indexOf('audio')==0)
	{
		cm = [
		{'caption':'Open File',					'linkurl':'javascript:selectFile(\''+fileurl+'\')',		'classname':'select'},
		{'caption':'Compress File',				'linkurl':'javascript:compressFile(\''+filepath+'\')',	'classname':'compress'},
		];
	}
	else if(filetype.indexOf('pdf')!=-1)
	{
		cm = [
		{'caption':'Open File',					'linkurl':'javascript:selectFile(\''+fileurl+'\')',		'classname':'select'},
		{'caption':'Compress File',				'linkurl':'javascript:compressFile(\''+filepath+'\')',	'classname':'compress'},
		];
	}
	else if(filetype.indexOf('shockwave')!=-1)
	{
		width = parseInt(attr['width']);
		height = parseInt(attr['height']);
		cm = [
		{'caption':'Open File',					'linkurl':'javascript:selectFile(\''+fileurl+'\')',		'classname':'select'},
		{'caption':'Compress File',				'linkurl':'javascript:compressFile(\''+filepath+'\')',	'classname':'compress'},
		];
	}
	else if(filetype.indexOf('application/zip')==0)
	{
		cm = [
		{'caption':'Open File',					'linkurl':'javascript:selectFile(\''+fileurl+'\')',		'classname':'select'},
		{'caption':'Extract File',				'linkurl':'javascript:extractFile(\''+filepath+'\')',	'classname':'extract'},
		];
	}
	else if(filetype.indexOf('text')==0 || filetype.indexOf('php')!=-1)
	{
		cm = [
		{'caption':'Open File',					'linkurl':'javascript:selectFile(\''+fileurl+'\')',		'classname':'select'},
		{'caption':'Compress File',				'linkurl':'javascript:compressFile(\''+filepath+'\')',	'classname':'compress'},
		];
	}
	else
	{
		cm = [
		{'caption':'Open File',					'linkurl':'javascript:selectFile(\''+fileurl+'\')',		'classname':'select'},
		{'caption':'Compress File',				'linkurl':'javascript:compressFile(\''+filepath+'\')',	'classname':'compress'},
		];
	}
	return cm;
}
function contextMenuListDir(filepath){
	filepath = addslashes(filepath);
	var cm = new Array();
	cm = [
	{'caption':'Open Directory',				'linkurl':'javascript:;" onClick="return openDir(\''+filepath+'\')', 'classname':'open'},
	{'caption':'Compress Directory',			'linkurl':'javascript:compressFile(\''+filepath+'\')',	'classname':'compress'},
	];
	return cm;
}

var skipondrop = false;
// file function

function previewFile(url, width, height, fullsize)
{
	var w = width, h = height, html = '';
	if(fullsize){
	html = '<img src="'+url+'" width="'+w+'" height="'+h+'" class="image2zoomout" onclick="previewFile(\''+url+'\', \''+width+'\', \''+height+'\', false);" />';
	}
	else
	{
	if(width>500)
	{
		w = 500;
		h = (height/width)*w;
	}
	html = '<img src="'+url+'" width="'+w+'" height="'+h+'" class="image2zoomin" onclick="previewFile(\''+url+'\', \''+width+'\', \''+height+'\', true);" />';
	}
	overlayDialog(html, w, h);
}

function compressFile(filepath)
{
	$('#common-dialog').dialog('destroy');
	$('#common-dialog-inner').html('');
	$('#common-dialog').attr('title', 'Compress File');
	$('#common-dialog').dialog({
		modal:true,
		width:400,
		height:165,
		buttons:
		{
			'OK':function(){
				var sf = $('#ffsourcepath').val();
				var tf = $('#fftargetpath').val();
				$.post('tool-file-operation.php?option=compressfile', {'sourcepath[]':sf,'targetpath':tf}, function(answer){
					if(answer == 'CONFLIC')
					{
						jqAlert('Please enter another name.', 'Invalid Name');
					}
					else if(answer == 'SUCCESS')
					{
						openDir(dirname(tf));
						$('#common-dialog').dialog('destroy');
					}
					else if(answer == 'FAILED')
					{
						jqAlert('The operation was failed.', 'Unknown Error Occured');
					}
					else if(answer=='READONLY')
					{
						jqAlert('The operation was disabled on read only mode.', 'Read Only');
					}
				});
			},
			'Cancel':function(){
				$(this).dialog('destroy');
			}
		}
	});
	var html = ''+
	'<form id="formfilerename" name="form1" method="post" action="">'+
	'<table width="100%" border="0" cellpadding="0" cellspacing="0" class="dialog-table">'+
	'<tr>'+
	'<td width="30%">Source Name</td>'+
	'<td><input type="text" name="ffsourcepath" id="ffsourcepath" class="input-text" autocomplete="off" readonly="readonly" /></td>'+
	'</tr>'+
	'<tr>'+
	'<td>Target Name</td>'+
	'<td><input type="text" name="fftargetpath" id="fftargetpath" class="input-text" autocomplete="off" /></td>'+
	'</tr>'+
	'</table>'+
	'</form>';
	$('#common-dialog-inner').html(html);
	$('#ffsourcepath').val(filepath);
	$('#fftargetpath').val(removefileextension(filepath)+'.zip');
}

function compressSelectedFile(){
	var dl = $('#address').val();
	var file2compress = '';
	var chk = 0;
	var html = '';
	$('.fileid:checked').each(function(index){
		file2compress += '<div>'+$(this).val()+'</div>';
		chk++;
	});
	
	if(chk){
	$('#common-dialog').dialog('destroy');
	$('#common-dialog-inner').html('');
	$('#common-dialog').attr('title', 'Compress File');
	$('#common-dialog').dialog({
		modal:true,
		width:400,
		height:250,
		buttons:
		{
			'OK':function(){
				var targetpath = $('#fftargetpath').val();
				var args = 'targetpath='+encodeURIComponent(targetpath);
				
				$('.fileid:checked').each(function(index){
				args+='&sourcepath[]='+encodeURIComponent($(this).val());
				});
				$.post('tool-file-operation.php?option=compressfile', {'postdata':args}, function(answer){
					if(answer=='SUCCESS' || answer=='EXIST')
					{
						openDir(dirname(targetpath));
						$('#common-dialog').dialog('destroy');
					}
					if(answer == 'CONFLIC')
					{
						jqAlert('Please enter another name.', 'Invalid Name');
					}
					else if(answer == 'SUCCESS')
					{
						openDir(dirname(tf));
						$('#common-dialog').dialog('destroy');
					}
					else if(answer == 'FAILED')
					{
						jqAlert('The operation was failed.', 'Unknown Error Occured');
					}
					else if(answer=='READONLY')
					{
						jqAlert('The operation was disabled on read only mode.', 'Read Only');
					}
				});
			},
			'Cancel':function(){
				$(this).dialog('destroy');
			}
		}
	});

	html = ''+
	'<table width="100%" border="0" cellpadding="0" cellspacing="0" class="dialog-table">'+
	'<tr>'+
	'<td width="30%">Target Name</td>'+
	'<td><input type="text" name="fftargetpath" id="fftargetpath" class="input-text" autocomplete="off" /></td>'+
	'</tr>'+
	'</table>'+
	'<div></div><div>File to be compressed:</div><div class="seleted-file-list">'+file2compress+'</div></div>';
	$('#common-dialog-inner').html(html);
	$('#fftargetpath').val(dl+'/new-compressed.zip');
	}
	else
	{
		jqAlert('No file selected.', 'Invalid Operation');
	}
}

function extractFile(filepath)
{
	if(!filepath)
	{
		var pth = $('.fileid:checked[data-iszip=true]').attr('value');
		if(pth!=undefined)
		{
			filepath = pth;
		}
		else
		{
			jqAlert('No file selected.', 'Invalid Operation');
			return;
		}
	}
	$('#common-dialog').dialog('destroy');
	$('#common-dialog-inner').html('');
	$('#common-dialog').attr('title', 'Extract File');
	$('#common-dialog').dialog({
		modal:true,
		width:400,
		height:160,
		buttons:
		{
			'OK':function(){
				var filepath = $('#ffsourcename').val();
				var targetdir = $('#fftargetdir').val();
				$.post('tool-file-operation.php?option=extractfile', {'filepath':filepath, 'targetdir':targetdir}, function(answer){
				if(answer=='SUCCESS')
				{
					openDir(targetdir);
					$('#common-dialog').dialog('destroy');
				}
				else if(answer=='FAILED')
				{
					jqAlert('This file is not a Zip file.', 'Invalid Format');
				}
				else if(answer=='READONLY')
				{
					jqAlert('The operation was disabled on read only mode.', 'Read Only');
				}
				});
			},
			'Cancel':function(){
				$(this).dialog('destroy');
			}
		}
	});
	var html = ''+
	'<form id="formfilerename" name="form1" method="post" action="">'+
	'<table width="100%" border="0" cellpadding="0" cellspacing="0" class="dialog-table">'+
	'<tr>'+
	'<td width="30%">Source Name</td>'+
	'<td><input type="text" name="ffsourcename" id="ffsourcename" class="input-text" autocomplete="off" readonly="readonly" /></td>'+
	'</tr>'+
	'<tr>'+
	'<td>Target Location</td>'+
	'<td><input type="text" name="fftargetdir" id="fftargetdir" class="input-text" autocomplete="off" /></td>'+
	'</tr>'+
	'</table>'+
	'</form>';
	$('#common-dialog-inner').html(html);
	$('#ffsourcename').val(filepath);
	$('#fftargetdir').val(dirname(filepath));
}

function uploadFile()
{
	$('#common-dialog').dialog('destroy');
	$('#common-dialog-inner').html('');
	$('#common-dialog').attr('title', 'Upload File');
	$('#common-dialog').dialog({
		modal:true,
		width:600,
		height:400,
		buttons:
		{
			'Close':function(){
				$(this).dialog('destroy');
			}
		}
	});
	var dl = $('#address').val();
	var html = ''+
	'<div id="imageuploader">'+
	'<form action="tool-upload-file.php" method="post" enctype="multipart/form-data">'+
	'FILE : <input type="file" name="file_zip" />'+
	'<input type="submit" value="upload" />'+
	'</form><div id="response"></div><ul id="image-list"></ul></div>'+
	'<iframe style="display:none; width:0px; height:0px;" id="formdumper" name="formdumper"></iframe>'+
	'</div>';

	$('#common-dialog-inner').html(html);
	$('#targetdir').val(dl);
}

function selectAll(sel){
	if(sel){
	$('.fileid').attr('checked', 'checked');
	}
	else{
	$('.fileid').removeAttr('checked');
	}
}
var togglethumb = false;

function refreshList(){
openDir();
}
var clipboardfile = {'operation':'', 'content':[]};

function preventSelect(url){
	skipondrop = true;
}

function initDropable(){
$('.file-list .row-data-dir').draggable({drag: function() {
	preventSelect($(this).attr('data-file-url'));
	$(this).css({'z-index':400,'opacity':0.8});
}});
$('.file-list .row-data-file').draggable({drag: function() {
	preventSelect($(this).attr('data-file-url'));
	$(this).css({'z-index':400,'opacity':0.8});
}});
$('.file-list .row-data-dir').droppable(
{
	activeClass:"directory-drop-active",
	hoverClass:"directory-drop-hover",
	drop: function(event, ui) 
	{
		var curlocation = ui.draggable.attr('data-file-location')+'/'+ui.draggable.attr('data-file-name');
		var targetdir = $(this).attr('data-file-location')+'/'+$(this).attr('data-file-name');
		var args = 'targetdir='+encodeURIComponent(targetdir);
		args+='&file[]='+encodeURIComponent(curlocation);
		var q = '?option=copyfile&deletesource=1';
		$.post('tool-file-operation.php'+q, {'postdata':args}, function(answer){
			if(answer=='SUCCESS' || answer=='EXIST')
			{
				openDir();
			}
			else if(answer=='READONLY')
			{
				jqAlert('The operation was disabled on read only mode.', 'Read Only');
			}
		});
		skipondrop = true;
		ui.draggable.hide('scale', {percent:0}, 300, function(){ui.draggable.css('display', 'none');openDir();});
		return false;
	}
});
}
function loadAnimationStart()
{
	$('#anim-loader').addClass('anim-active');
}
function loadAnimationStop()
{
	$('#anim-loader').removeClass('anim-active');
}

function openDir(filepath, selfile)
{
if(!skipondrop)
{
	loadAnimationStart();
	var ret = true;
	if(!filepath)
	{
		filepath = $('#address').val();
		ret = false;
	}
	else
	{
		filepath = filepath.trim('/');
	}
	$('#address').val(filepath);
	var arg = {};
	if(togglethumb)
	{
		arg = {'dir':filepath, 'thumbnail':1};
	}
	else
	{
		arg = {'dir':filepath};
	}
	$.get('tool-load-file.php', arg, function(answer){
	$('#file-container').html(answer);
	// restore selected file
	try{
	if(selfile.length){
		var fn = '';
		$('.fileid').each(function(index){
			fn = $(this).val();
			if(inArray(fn, selfile))
			{
				$(this).attr('checked', 'checked');
			}
		});
	}
	}
	catch(e){}
	initContextMenuFile();
	initContextMenuDir();
	setCheckRelation();
	initDropable();
	loadAnimationStop();
	});	
	var pth = '';
	$.get('tool-load-dir.php', {'seldir':filepath}, function(answer){
		$('.dir-control').each(function(index){
		pth = $(this).attr('data-file-location')+'/'+$(this).attr('data-file-name');
		if(pth[pth.length]=='/') pth = pth.substr(0, pth.length-1);
		if(pth[0]=='/') pth = pth.substr(1);
		if(filepath==pth)
		{
			$(this).children('ul').remove();
			$(this).append(answer);
		}
		});
	});
	return ret;
}
skipondrop = false;
$('.row-data-dir').css({'left':'0px','top':'0px','z-index':0,'opacity':1});
$('.row-data-file').css({'left':'0px','top':'0px','z-index':0,'opacity':1});
}

function selectFile(url){
if(!skipondrop)
{
	selectFileIndex(url);
}
skipondrop = false;
$('.row-data-dir').css({'left':'0px','top':'0px','z-index':0,'opacity':1});
$('.row-data-file').css({'left':'0px','top':'0px','z-index':0,'opacity':1});
}