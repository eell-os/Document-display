<?php
header('Content-Type: application/json; charset=utf-8');

$dir = '../storage/'; // 文件存储目录

// 扫描目录
$files = scandir($dir);

$fileList = [];
foreach ($files as $file) {
    if ($file != '.' && $file != '..') {
        $filePath = $dir . $file;
        $fileList[] = [
            'name' => $file,
            'type' => is_dir($filePath) ? 'folder' : 'file',
            'size' => is_file($filePath) ? filesize($filePath) : 0, // 文件夹大小为0
            'timestamp' => filemtime($filePath) // 最后修改时间戳
        ];
    }
}

echo json_encode($fileList);