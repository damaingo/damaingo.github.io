import os
from pathlib import Path
from mutagen.mp3 import MP3
from mutagen.easyid3 import EasyID3


def get_mp3_artist(file_path):
    """只获取MP3作者信息"""
    try:
        # 尝试读取ID3标签中的艺术家
        audio = EasyID3(file_path)
        artist = audio.get('artist', [''])[0]
        if artist:
            return artist
    except:
        pass

    # 如果标签中没有作者，从文件名解析
    filename = Path(file_path).stem

    # 常见格式1: "艺术家 - 标题.mp3"
    if ' - ' in filename:
        artist = filename.split(' - ')[0].strip()
        return artist

    # 常见格式2: "艺术家_标题.mp3"
    elif '_' in filename:
        artist = filename.split('_')[0].strip()
        return artist

    # 常见格式3: "艺术家·标题.mp3"
    elif '·' in filename:
        artist = filename.split('·')[0].strip()
        return artist

    # 常见格式4: [艺术家]标题.mp3
    elif ']' in filename and '[' in filename:
        import re
        match = re.search(r'\[(.*?)\]', filename)
        if match:
            return match.group(1).strip()

    # 都没有找到，返回空字符串
    return ''


def batch_get_artists(directory_path):
    """批量获取目录下所有MP3的作者"""
    artists = {}

    for file_path in Path(directory_path).rglob('*.mp3'):
        artist = get_mp3_artist(file_path)
        filename = file_path.name
        artists[filename] = artist
        print(f"{filename} -> {artist}")

    return artists


# ===== 直接使用示例 =====
if __name__ == '__main__':
    # 配置你的音乐目录


    # 获取单个文件作者
    single_file = '../music/Windy Hill (风之谷) .mp3'
    artist = get_mp3_artist(single_file)
    print(f"单文件作者: {artist}")

    print("\n" + "=" * 50 + "\n")

    # 批量获取所有作者
    print("批量获取作者:")


    print("\n" + "=" * 50 + "\n")

    # 只打印有作者的文件
    print("有作者信息的文件:")
