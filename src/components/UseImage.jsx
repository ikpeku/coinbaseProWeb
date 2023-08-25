import React, { useEffect, useState } from "react";
import { Upload, Modal, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useLayoutEffect } from "react";


const getBase64 = file => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};


const FileUpload = ({ fileList, setFileList, photoUrl }) => {
    // const [] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState(false);
    const [previewTitle, setPreviewTitle] = useState(false);

    const { Dragger } = Upload;

    const handleCancel = () => setPreviewVisible(false);

    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(
            file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
        );
    };

    const beforeUpload = file => {
        if (!["image/jpeg", "image/png"].includes(file.type)) {
            message.error(`${file.name} is not a valid image type`, 2);
            return null;
        }
        return false;
    };

    const handleChange = ({ fileList }) => {
        setSubmitting(true)
        return setFileList(fileList.filter(file => file.status !== "error"));
    }


    const onRemove = async file => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);

        setFileList(newFileList);

    };

    useEffect(() => {
        // console.log(fileList)
        if (fileList?.length === 0 || !fileList) {
            setSubmitting(false)
        }
    }, [fileList])





    // const handleFinish = async values => {
    //     values.preventDefault()
    //     try {
    //         setSubmitting(true);

    //         // await Promise.all(
    //         //     fileList[0].map(async file => {
    //         //         const fileName = `uploads/images/${Date.now()}-${file.name}`;
    //         //         const fileRef = storageRef.child(fileName);
    //         //         try {
    //         //             const designFile = await fileRef.put(file.originFileObj);
    //         //             const downloadUrl = await designFile.ref.getDownloadURL();
    //         //             const item = {
    //         //                 url: downloadUrl,
    //         //                 path: fileName,
    //         //                 uploadedAt: firebase.firestore.Timestamp.now(),
    //         //             };
    //         //             await db.collection("images").add(item);
    //         //         } catch (e) {
    //         //             console.log(e);
    //         //         }
    //         //     })
    //         // );




    //         setFileList([]);
    //         message.success(`Images added successfully.`, 2);
    //     } catch (err) {
    //         console.log(err);
    //         message.error(`Error adding images.`, 2);
    //     } finally {
    //         setSubmitting(false);
    //     }
    // };



    return (
        <div className="mediaFormContainer mb-10">
            <div className="uploadContainer">
                <Dragger
                    listType="picture-card"
                    fileList={fileList}
                    beforeUpload={beforeUpload}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    onRemove={onRemove}
                    multiple={false}
                    maxCount={1}
                //   disabled={disableUpload}
                >
                    <div className="uploadIcon">
                        <UploadOutlined />
                    </div>
                    <div className="uploadText">
                        <p>Drag and drop here</p>
                        <p>OR</p>
                        <p>Click</p>
                    </div>
                </Dragger>
            </div>
            {/* {!previewVisible && <Form onFinish={handleFinish}>
                <Form.Item {...tailLayout}>
                    <Button shape="round" htmlType="submit">
                        {submitting ? "Uploading" : "Upload"}
                    </Button>
                </Form.Item>
            </Form>} */}
            <Modal

                open={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img alt="example" style={{ width: "100%" }} src={previewImage} />
            </Modal>
            {!submitting && photoUrl && <img alt="example" className="w-1/3 max-h-20 mx-auto" src={photoUrl} />}
        </div>
    );
};

export default FileUpload;