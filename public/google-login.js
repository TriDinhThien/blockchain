export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: "No token provided" });
    }

    // Verify token với Google
    const googleRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    );

    const data = await googleRes.json();

    if (data.error_description) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // Thành công
    return res.status(200).json({
      success: true,
      email: data.email,
      name: data.name,
      picture: data.picture,
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
