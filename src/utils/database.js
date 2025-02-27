import { Firestore } from '@google-cloud/firestore';

class FirestoreService {
  constructor() {
    // Tạo kết nối đến Firestore
    this.db = new Firestore({ 
      projectId: process.env.PROJECT_ID,
      databaseId: process.env.FIRESTORE_DB
    })
  }

  // Thêm document vào một collection (hoặc đường dẫn cụ thể)
  async addDocument(path, data) {
    try {
      const res = await this.db.doc(path).set(data);
      console.log(`Document added or updated at path: ${path}`);
      return res;
    } catch (error) {
      console.error('Error adding document: ', error);
      throw error;
    }
  }

  // Lấy một document từ đường dẫn
  async getDocument(path) {
    try {
      const doc = await this.db.doc(path).get();
      if (!doc.exists) {
        console.log('Document not found!');
        return null;
      }
      return {id: doc.id, ...doc.data()};
    } catch (error) {
      console.error('Error getting document: ', error);
      throw error;
    }
  }

  // Cập nhật document tại một đường dẫn cụ thể
  async updateDocument(path, data) {
    try {
      await this.db.doc(path).update(data);
      console.log(`Document at path ${path} updated`);
    } catch (error) {
      console.error('Error updating document: ', error);
      throw error;
    }
  }

  // Xóa một document tại một đường dẫn
  async deleteDocument(path) {
    try {
      await this.db.doc(path).delete();
      console.log(`Document at path ${path} deleted`);
    } catch (error) {
      console.error('Error deleting document: ', error);
      throw error;
    }
  }

  // Thực hiện tìm kiếm theo điều kiện (query) tại collection
  async queryDocuments(collectionPath, field, operator, value) {
    try {
      const snapshot = await this.db.collection(collectionPath)
        .where(field, operator, value)
        .get();
      if (snapshot.empty) {
        console.log('No matching documents found.');
        return [];
      }
      let documents = [];
      snapshot.forEach(doc => {
        documents.push({id: doc.id, ...doc.data()});
      });
      return documents;
    } catch (error) {
      console.error('Error querying documents: ', error);
      throw error;
    }
  }

  // Get all documents in a collection
  async getCollection(collectionPath) {
    try {
      const snapshot = await this.db.collection(collectionPath).get();
      if (snapshot.empty) {
        console.log('No documents found in collection.');
        return [];
      }
      let documents = [];
      snapshot.forEach(doc => {
        documents.push({id: doc.id, ...doc.data()});
      });
      return documents;
    } catch (error) {
      console.error('Error getting collection: ', error);
      throw error;
    }
  }
}

export default FirestoreService;
