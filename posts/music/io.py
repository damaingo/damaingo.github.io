import json
from pathlib import Path
from mutagen.easyid3 import EasyID3
from mutagen.flac import FLAC
from mutagen.mp4 import MP4


def get_artist_title(file_path):
    """获取作者和曲名"""
    artist = '凤凰传奇'  # 默认
    title = file_path.stem

    try:
        suffix = file_path.suffix.lower()

        if suffix == '.mp3':
            audio = EasyID3(file_path)
            artist = audio.get('artist', [artist])[0]
            title = audio.get('title', [title])[0]
        elif suffix == '.flac':
            audio = FLAC(file_path)
            artist = audio.get('artist', [artist])[0]
            title = audio.get('title', [title])[0]
        elif suffix == '.m4a':
            audio = MP4(file_path)
            artist = audio.get('\xa9ART', [artist])[0]
            title = audio.get('\xa9nam', [title])[0]
    except:
        # 文件名解析
        if ' - ' in file_path.stem:
            parts = file_path.stem.split(' - ')
            artist = parts[0]
            title = parts[1]

    return artist, title


# 扫描音乐
path = Path(".")
music_list = []

for i, file in enumerate(path.rglob('*.mp3'), 1):
    artist, title = get_artist_title(file)
    music_list.append({
        "id": i,
        "title": title,
        "author": artist,
        "album": "神经信号已接驳",
        "mdFile": "music/"+str(file.relative_to(path))
    })
    print(f"{i}. {artist} - {title}")

# 保存
with open("music.json", "w", encoding="utf-8") as f:
    json.dump(music_list, f, ensure_ascii=False, indent=2)

print(f"\n✅ 完成！共 {len(music_list)} 首")