import 'package:flutter/material.dart';

class ImagePickerWidget {
  static Future<String?> showImageSourceDialog(BuildContext context) async {
    return showDialog<String?>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Chọn ảnh'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: const Icon(Icons.photo_library),
                title: const Text('Thư viện ảnh'),
                onTap: () {
                  Navigator.of(context).pop('gallery');
                },
              ),
              ListTile(
                leading: const Icon(Icons.camera_alt),
                title: const Text('Máy ảnh'),
                onTap: () {
                  Navigator.of(context).pop('camera');
                },
              ),
            ],
          ),
        );
      },
    );
  }

  static void showImagePickerNotImplemented(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Tính năng chọn ảnh sẽ được cập nhật sau'),
        duration: Duration(seconds: 2),
      ),
    );
  }
}
