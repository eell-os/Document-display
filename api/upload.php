<?php
header('Content-Type: application/json; charset=utf-8');

$dir = '../storage/'; // 文件存储目录
$sharedPassword = '123456'; //  <--- 定义共享密码变量
$maxFileSizeGB = 1; //  <--- 设置最大文件大小为 1GB

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['file'])) {
    $file = $_FILES['file'];
    $inputPassword = $_POST['password'] ?? ''; //  <--- 获取上传密码，允许为空

    $fileSizeGB = $file['size'] / 1073741824; // 文件大小，单位 GB

    if ($fileSizeGB > $maxFileSizeGB) { //  <--- 判断文件大小是否超过 1GB
        if (!$inputPassword || $inputPassword !== $sharedPassword) { //  <---  如果超过 1GB，需要验证密码
            echo json_encode(['success' => false, 'message' => '文件超过 1GB，需要密码才能上传，密码错误或未提供']);
            exit;
        }
    }


    if ($file['error'] === UPLOAD_ERR_OK) {
        $filename = $file['name'];
        $destination = $dir . $filename;

        if (move_uploaded_file($file['tmp_name'], $destination)) {
            echo json_encode(['success' => true, 'message' => '文件上传成功']);
        } else {
            echo json_encode(['success' => false, 'message' => '文件上传失败']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => '上传错误: ' . $file['error']]);
    }
} else {
    echo json_encode(['success' => false, 'message' => '无效的请求']);
}