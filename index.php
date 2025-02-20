<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>eell的网盘</title>
    <link rel="stylesheet" href="public/css/style.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11.7.12/dist/sweetalert2.min.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-left">
                <button class="upload-btn" title="上传文件"></button>
                <button class="create-folder-btn" title="创建文件夹"></button>
            </div>
            <!--<div>我的网盘</div>-->
        </div>

        <table id="fileList" class="file-list">
            <thead>
                <tr>
                    <th>名称</th>
                    <th>类型</th>
                    <th>大小</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                </tbody>
        </table>
    </div>
    
    <footer class="footer">  <p>版权所有 &copy; <?php echo date('Y'); ?> eell的网盘. <br> Powered by Gemini 2.0 and eell.</p>
    </footer>
    <!--建议保留作者署名/或者做一些修改-->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.7.12/dist/sweetalert2.all.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
    <script src="public/js/script.js"></script>
    <script src="public/js/script.js"></script>
</body>
</html>