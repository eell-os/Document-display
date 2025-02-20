<?php
header('Content-Type: application/json; charset=utf-8');

$dir = '../storage/'; // 文件存储目录
$sharedPassword = '123456'; //  <--- 定义共享密码变量 (与 upload.php 和 script.js 中的密码保持一致)


if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['name']) && isset($_POST['password'])) {
    $filename = $_POST['name'];
    $inputPassword = $_POST['password'];
    $filePath = $dir . $filename;

    if ($inputPassword !== $sharedPassword) { //  <--- 使用共享密码变量进行验证
        echo json_encode(['success' => false, 'message' => '密码错误，删除失败']);
        exit;
    }

    if (file_exists($filePath)) {
        if (is_dir($filePath)) {
            if (rmdir($filePath)) {
                echo json_encode(['success' => true, 'message' => '文件夹删除成功']);
            } else {
                echo json_encode(['success' => false, 'message' => '文件夹删除失败，可能文件夹不为空']);
            }
        } else {
            if (unlink($filePath)) {
                echo json_encode(['success' => true, 'message' => '文件删除成功']);
            } else {
                echo json_encode(['success' => false, 'message' => '文件删除失败']);
            }
        }
    } else {
        echo json_encode(['success' => false, 'message' => '文件不存在']);
    }
} else {
    echo json_encode(['success' => false, 'message' => '无效的请求']);
}