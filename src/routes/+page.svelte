<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>simulvid</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.9.3/css/bulma.min.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .video-container {
            margin-bottom: 20px;
        }

        .video-player {
            width: 100%;
        }

        .video-info {
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
        }

        .video-title {
            font-size: 24px;
            margin-bottom: 10px;
        }

        .video-description {
            font-size: 16px;
        }

        .debug-info {
            margin-top: 20px;
            padding: 10px;
            background-color: #f0f0f0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="video-container">
            <!-- Video Player -->
            <iframe class="video-player" width="100%" height="500" src="https://www.youtube.com/embed/{video_id}" frameborder="0" allowfullscreen></iframe>
        </div>
        <div class="video-info">
            <!-- Video Title -->
            <h1 class="video-title">simulvid</h1>
            <!-- Video Description -->
            <p class="video-description">Frenvid is a web app that lets you play videos on multiple devices at the same time.</p>
        </div>
        <!-- Debug Info -->
        <div class="debug-info">
            {id} {datetime}
        </div>
    </div>
</body>
</html>
