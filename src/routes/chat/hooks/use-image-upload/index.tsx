import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import { Alert, Platform } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { useState } from "react";
import { showErrorToast } from "../../../../utils";

const PROCESSING_IMAGE_ERROR =
  "An error happened while processing your image. Try again.";

const SEND_IMAGE_ERROR =
  "An error happened while trying to send your image. Try again.";

export default function useImageUpload(userId: string, chatId: string) {
  const [loading, setLoading] = useState(false);

  async function sendImage(imageUrl: string) {
    const newMessage = {
      id: firestore()
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .doc().id,
      senderId: userId,
      text: "",
      imageUrl,
      timestamp: new Date(),
    };

    const chatRef = firestore().collection("chats").doc(chatId);
    await chatRef.update({
      messages: firestore.FieldValue.arrayUnion(newMessage),
    });

    const chatSummaryRef = firestore().collection("chatSummaries").doc(chatId);
    await chatSummaryRef.update({
      lastMessage: {
        read: false,
        senderId: userId,
        text: "Image",
        timestamp: firestore.FieldValue.serverTimestamp(),
      },
    });
  }

  async function uploadImage(uri: string) {
    const fileName = `${userId}/${Date.now()}.jpg`;

    const reference = storage().ref(fileName);

    const cleanedUri = Platform.OS === "ios" ? uri.replace("file://", "") : uri;

    const task = reference.putFile(cleanedUri);

    setLoading(true);

    try {
      await task;
      const imageUrl = await reference.getDownloadURL();

      await sendImage(imageUrl);
    } catch (error) {
      showErrorToast({
        text2: SEND_IMAGE_ERROR,
      });
    } finally {
      setLoading(false);
    }
  }

  async function openCamera() {
    await launchCamera(
      {
        mediaType: "photo",
      },
      (response) => {
        if (response.errorMessage) {
          return showErrorToast({
            text2: PROCESSING_IMAGE_ERROR,
          });
        }
        const uri = response.assets && response.assets[0].uri;

        if (!uri) {
          return showErrorToast({
            text2: PROCESSING_IMAGE_ERROR,
          });
        }

        uploadImage(uri);
      }
    );
  }

  async function openGallery() {
    await launchImageLibrary(
      {
        mediaType: "photo",
        selectionLimit: 1,
      },
      (response) => {
        if (response.errorMessage) {
          return showErrorToast({
            text2: PROCESSING_IMAGE_ERROR,
          });
        }
        const uri = response.assets && response.assets[0].uri;

        if (!uri) {
          return showErrorToast({
            text2: PROCESSING_IMAGE_ERROR,
          });
        }

        uploadImage(uri);
      }
    );
  }

  function openImageUploadOptions() {
    Alert.alert("Pick an option", undefined, [
      {
        text: "Gallery",
        onPress: openGallery,
      },
      {
        text: "Camera",
        onPress: openCamera,
      },
      {
        text: "Cancel",
        style: "destructive",
      },
    ]);
  }

  return {
    openImageUploadOptions,
    loading,
  };
}
