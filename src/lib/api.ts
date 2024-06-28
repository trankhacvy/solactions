import fetcher from "./fetcher";

export interface FakeUploadResponse {
  originalname: string;
  filename: string;
  location: string;
}

class Api {
  headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  public fakeUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return fetcher<FakeUploadResponse>(
      "https://api.escuelajs.co/api/v1/files/upload",
      {
        method: "POST",
        body: formData,
      },
    );
  }
}

export default new Api();
