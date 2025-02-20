<?php
header('Content-Type: application/json; charset=utf-8');

$dir = '../storage/'; // 文件存储目录

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['folderName'])) {
    $folderName = $_POST['folderName'];
    $newFolderPath = $dir . $folderName;

    if (!file_exists($newFolderPath)) {
        if (mkdir($newFolderPath, 0777, true)) { // 创建文件夹，权限设置为 0777
            echo json_encode(['success' => true, 'message' => '文件夹创建成功']);
        } else {
            echo json_encode(['success' => false, 'message' => '文件夹创建失败']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => '文件夹已存在']);
    }
} else {
    echo json_encode(['success' => false, 'message' => '无效的请求']);
}
