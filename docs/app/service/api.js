export class API {
  static firebase = "http://127.0.0.1:5001/"

  static checkFirebase = async () => {
    const isDevMode = fetch("http://127.0.0.1:5001")
      .then((res) => res.ok)
      .catch(() => undefined);

    if (!isDevMode) this.firebase = '';
  }
}