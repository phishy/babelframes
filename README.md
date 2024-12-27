# BabelFrames

BabelFrames is a modern web application for video transcription and translation, leveraging the power of Next.js for its frontend, AWS Transcribe for accurate speech-to-text processing, and AWS S3 for scalable and secure storage. This tool is ideal for localizing video content and simplifying workflows for global distribution.

## Features

- **Automatic Transcription**: Extracts speech from video and converts it to text using AWS Transcribe.
- **Translation Support**: Easily translate transcriptions into multiple languages.
- **Interactive UI**: User-friendly interface for managing and editing transcription timelines.
- **Undo/Redo Support**: Allows you to undo or redo changes, with state stored in localStorage for persistence.
- **Secure Storage**: Stores video and transcription data in AWS S3 for reliability and accessibility.
- **Export Options**: Export transcription and translation data in various formats, including SRT, ASS, VTT, and TTML.

## Demo

![BabelFrames Screenshot](docs/screenshot.png)

## Prerequisites

Before you begin, ensure you have the following:

- Node.js and npm installed.
- AWS account with access to S3 and Transcribe services.
- AWS CLI configured with appropriate permissions.

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/babelframes.git
   cd babelframes
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env.local` file in the root directory and add the following:

   ```bash
   NEXT_PUBLIC_AWS_REGION=<your-aws-region>
   NEXT_PUBLIC_AWS_S3_BUCKET=<your-s3-bucket-name>
   AWS_ACCESS_KEY_ID=<your-aws-access-key>
   AWS_SECRET_ACCESS_KEY=<your-aws-secret-key>
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

## Usage

1. Upload a video file to start the transcription process.
2. Edit and fine-tune the transcription timeline through the interactive UI.
3. Utilize undo/redo functionality to make precise edits without worry.
4. Translate the transcription into your desired language.
5. Export the final transcription or translation in your preferred format (SRT, ASS, VTT, or TTML).

## Deployment

To deploy BabelFrames to a production environment:

1. Build the application:

   ```bash
   npm run build
   ```

2. Deploy to a hosting platform such as Vercel, AWS Amplify, or your custom server.

3. Ensure your environment variables are configured on the hosting platform.

## Architecture

- **Frontend**: Built with [Next.js](https://nextjs.org/) for server-side rendering and fast client-side transitions.
- **Backend**: Integrates AWS Transcribe for speech-to-text processing.
- **Storage**: Utilizes AWS S3 for storing video files and transcription data.

## Contributing

Contributions are welcome! If you have ideas or suggestions, please submit a pull request or open an issue.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [AWS Transcribe](https://aws.amazon.com/transcribe/)
- [AWS S3](https://aws.amazon.com/s3/)

---

Start simplifying your video transcription and translation workflows with BabelFrames today!
