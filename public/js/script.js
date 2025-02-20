document.addEventListener('DOMContentLoaded', function () {
    const fileListBody = document.querySelector('#fileList tbody');
    const uploadBtn = document.querySelector('.upload-btn');
    const createFolderBtn = document.querySelector('.create-folder-btn');

    // 共享密码变量
    const sharedPassword = '123456';

    // Flag 变量，用于控制 uploadBtn 点击事件处理函数只执行一次  <---  添加 Flag 变量
    let isUploadButtonClicked = false;

    // SVG 图标
    const uploadSvg = `<svg class="upload-icon" viewBox="0 0 24 24"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>`;
    const createFolderSvg = `<svg class="create-folder-icon" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>`;
    const deleteSvg = `<svg class="delete-icon" viewBox="0:0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`;

    uploadBtn.innerHTML = uploadSvg;
    createFolderBtn.innerHTML = createFolderSvg;

    // 获取文件列表并显示
    function fetchFileList() {
        fetch('api/files.php')
            .then(response => response.json())
            .then(data => {
                fileListBody.innerHTML = ''; // 清空旧列表
                if (data.length === 0) {
                    const row = fileListBody.insertRow();
                    const cell = row.insertCell();
                    cell.colSpan = 4;
                    cell.textContent = '暂时没有文件...';
                    cell.style.textAlign = 'center';
                    cell.style.padding = '20px';
                } else {
                    data.forEach(file => {
                        const row = fileListBody.insertRow();
                        const nameCell = row.insertCell();
                        const typeCell = row.insertCell();
                        const sizeCell = row.insertCell();
                        const actionsCell = row.insertCell();

                        nameCell.textContent = file.name;
                        typeCell.textContent = file.type;
                        sizeCell.textContent = file.type === 'file' ? formatFileSize(file.size) : '-';
                        actionsCell.classList.add('file-actions');

                        // 删除按钮
                        const deleteButton = document.createElement('button');
                        deleteButton.innerHTML = deleteSvg;
                        deleteButton.addEventListener('click', () => deleteFile(file.name));
                        actionsCell.appendChild(deleteButton);
                    });
                }
            });
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes < 1024) {
            return bytes + ' B';
        } else if (bytes < 1048576) {
            return (bytes / 1024).toFixed(2) + ' KB';
        } else if (bytes < 1073741824) { //  <---  增加 GB 单位
            return (bytes / 1048576).toFixed(2) + ' MB';
        } else {
            return (bytes / 1073741824).toFixed(2) + ' GB';
        }
    }

    // 文件上传
    uploadBtn.addEventListener('click', () => {
        if (isUploadButtonClicked) { //  <---  检查 Flag 变量，如果为 true，直接返回
            return;
        }
        isUploadButtonClicked = true; //  <---  设置为 true，表示点击事件处理函数开始执行

        const input = document.createElement('input');
        input.type = 'file';
        input.style.display = 'none';
        document.body.appendChild(input);

        input.addEventListener('change', function handleFileChange(event) {
            const file = input.files[0];
            if (file) {
                const fileSizeGB = file.size / 1073741824;
                let needPassword = false;
                let uploadPassword = '';
                if (fileSizeGB > 1) {
                    needPassword = true;
                }

                const uploadFileAction = (password = '') => {
                    const formData = new FormData();
                    formData.append('file', file);
                    if (password) {
                        formData.append('password', password);
                    }

                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', 'api/upload.php');

                    Swal.fire({
                        title: '文件上传中',
                        html: `<div class="progress-container"> <div class="progress-bar" style="width: 0%;"> <div class="progress-value">0%</div> </div> </div>`,
                        allowOutsideClick: false,
                        showCancelButton: false,
                        showConfirmButton: false,
                        willOpen: () => {
                            Swal.showLoading();
                        },
                    });

                    xhr.upload.onprogress = function (event) {
                        if (event.lengthComputable) {
                            const percentComplete = (event.loaded / event.total) * 100;
                            updateSweetAlertProgressBar(percentComplete);
                        }
                    };

                    xhr.onload = function () {
                        isUploadButtonClicked = false; //  <---  上传完成后重置 Flag 变量
                        Swal.close();
                        const data = JSON.parse(xhr.responseText);

                        if (data.success) {
                            Toastify({
                                text: '文件上传成功: ' + file.name,
                                duration: 3000,
                                close: false,
                                gravity: "bottom",
                                position: "center",
                                backgroundColor: "#4CAF50",
                                stopOnFocus: true,
                            }).showToast();
                            fetchFileList();
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: '文件上传失败',
                                text: data.message,
                            });
                        }
                    };

                    xhr.onerror = function () {
                        isUploadButtonClicked = false; //  <---  上传出错时重置 Flag 变量
                        Swal.close();
                        Swal.fire({
                            icon: 'error',
                            title: '上传出错',
                            text: '网络错误，请稍后重试',
                        });
                    };

                    xhr.send(formData);
                };


                if (needPassword) {
                    Swal.fire({
                        title: '文件上传需要密码',
                        text: `您上传的文件超过 1GB，请输入上传密码:`,
                        input: 'password',
                        inputPlaceholder: '请输入上传密码',
                        inputAttributes: {
                            minlength: 6,
                            autocapitalize: 'off',
                            autocomplete: 'off'
                        },
                        confirmButtonText: '上传',
                        cancelButtonText: '取消',
                        showCancelButton: true,
                        inputValidator: (value) => {
                            if (!value) {
                                return '密码不能为空！'
                            }
                        },
                    }).then((result) => {
                        if (result.isConfirmed) {
                            uploadPassword = result.value;
                            uploadFileAction(uploadPassword);
                        }
                    });
                } else {
                    uploadFileAction();
                }
            }
            document.body.removeChild(input);
        }, { once: true });

        input.click();
    });


    function updateSweetAlertProgressBar(percentage) {
        const progressBar = document.querySelector('.swal2-html-container .progress-bar');
        const progressValue = document.querySelector('.swal2-html-container .progress-value');
        if (progressBar && progressValue) {
            progressBar.style.width = percentage + '%';
            progressValue.textContent = percentage.toFixed(0) + '%';
        }
    }

    // 删除文件或文件夹
    function deleteFile(filename) {
        Swal.fire({
            title: '删除文件确认',
            text: `确定要删除 "${filename}" 吗？删除后将无法恢复!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '确认删除',
            cancelButtonText: '取消',
            input: 'password',
            inputPlaceholder: '请输入删除密码',
            inputAttributes: {
                minlength: 6,
                autocapitalize: 'off',
                autocomplete: 'off'
            },
            inputValidator: (value) => {
                if (!value) {
                    return '密码不能为空！'
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const password = result.value;
                const formData = new FormData();
                formData.append('name', filename);
                formData.append('password', password);

                fetch('api/delete.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Toastify({
                            text: '删除成功: ' + filename,
                            duration: 3000,
                            close: false,
                            gravity: "bottom",
                            position: "center",
                            backgroundColor: "#4CAF50",
                            stopOnFocus: true,
                        }).showToast();
                        fetchFileList();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: '删除失败',
                            text: data.message,
                        });
                    }
                });
            }
        })
    }

    // 创建文件夹
    createFolderBtn.addEventListener('click', () => {
        Swal.fire({
            title: '创建文件夹',
            text: '请输入文件夹名称:',
            input: 'text',
            showCancelButton: true,
            confirmButtonText: '创建',
            cancelButtonText: '取消',
            inputValidator: (value) => {
                if (!value) {
                    return '文件夹名称不能为空！'
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const folderName = result.value;
                const formData = new FormData();
                formData.append('folderName', folderName);

                fetch('api/create-folder.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Toastify({
                            text: '文件夹创建成功: ' + folderName,
                            duration: 3000,
                            close: false,
                            gravity: "bottom",
                            position: "center",
                            backgroundColor: "#4CAF50",
                            stopOnFocus: true,
                        }).showToast();
                        fetchFileList();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: '文件夹创建失败',
                            text: data.message,
                        });
                    }
                });
            }
        })
    });

    // 初始加载文件列表
    fetchFileList();
});
