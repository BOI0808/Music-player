const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "KHOI_PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const volumeContainer = $(".volume-container");
const volume = $("#volume");
const highVolume = $(".volume-control__volume-high");
const low = $(".volume-control__volume-low");
const offVolume = $(".volume-control__volume-off");
const xmarkVolume = $(".volume-control__volume-xmark");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  isSeeking: false,
  isMute: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  shuffledList: [],
  songs: [
    {
      name: "Nevada",
      singer: "Vicetone",
      path: "./assets/music/Nevada.mp3",
      image: "./assets/img/Nevada.jpg",
    },
    {
      name: "Summer Time",
      singer: "K-391",
      path: "./assets/music/Summertime.mp3",
      image: "./assets/img/Summertime.jpg",
    },
    {
      name: "Monody",
      singer: "TheFatRat",
      path: "./assets/music/Monody.mp3",
      image: "./assets/img/Monody.jpg",
    },
    {
      name: "Reality",
      singer: "Lost Frequencies",
      path: "./assets/music/Reality.mp3",
      image: "./assets/img/Reality.jpg",
    },
    {
      name: "Waiting For Love",
      singer: "Avicii",
      path: "./assets/music/Waitingforlove.mp3",
      image: "./assets/img/Waitingforlove.jpg",
    },
    {
      name: "Lemon Tree",
      singer: "DJ DESA REMIX",
      path: "./assets/music/Lemontree.mp3",
      image: "./assets/img/Lemontree.jpg",
    },
    {
      name: "Sugar",
      singer: "Maroon 5",
      path: "./assets/music/Sugar.mp3",
      image: "./assets/img/Sugar.jpg",
    },
    {
      name: "My love",
      singer: "Westlife",
      path: "./assets/music/Mylove.mp3",
      image: "./assets/img/Mylove.jpg",
    },
    {
      name: "Attention",
      singer: "Charlie Puth",
      path: "./assets/music/Attention.mp3",
      image: "./assets/img/Attention.jpg",
    },
    {
      name: "Monsters",
      singer: "Katie sky",
      path: "./assets/music/Monsters.mp3",
      image: "./assets/img/Monster.jpg",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `<div class="song ${
        index === this.currentIndex ? "active" : ""
      }" data-index="${index}">
          <div
            class="thumb"
            style="
              background-image: url('${song.image}');
            "
          ></div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>`;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  updateRangeBackground: function (range, value) {
    range.style.background = `linear-gradient(to right, var(--primary-color) ${value}%, #ccc ${value}%)`;
  },
  updateVolumeIcon: function (volumeValue) {
    if (volumeValue === 0) {
      low.style.display = "none";
      offVolume.style.display = "block";
      highVolume.style.display = "none";
      xmarkVolume.style.display = "none";
    } else if (volumeValue < 0.5) {
      low.style.display = "block";
      offVolume.style.display = "none";
      highVolume.style.display = "none";
      xmarkVolume.style.display = "none";
    } else {
      offVolume.style.display = "none";
      low.style.display = "none";
      highVolume.style.display = "block";
      xmarkVolume.style.display = "none";
    }
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lí CD quay / dừng
    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000,
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();

    // Xử lí phóng to / thu nhỏ cd
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xử lí khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi song được played
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // Khi song bị paused
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (!_this.isSeeking) {
        if (audio.duration) {
          const progressPercent = Math.floor(
            (audio.currentTime / audio.duration) * 100
          );
          progress.value = progressPercent;

          // Cập nhập màu nên thanh background
          _this.updateRangeBackground(progress, progress.value);

          _this.setConfig("currentTime", audio.currentTime);
        }
      }
    };

    // Xử lí khi tua song
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Khi user đang giữ chuột trên thanh progress
    progress.onmousedown = function (e) {
      _this.isSeeking = true;
    };

    // Khi user thả chuột trên thanh progress
    progress.onmouseup = function (e) {
      _this.isSeeking = false;
    };

    // Cập nhập màu background thanh progress khi user tua bài hát
    progress.oninput = function () {
      const value = this.value;
      _this.updateRangeBackground(this, value);
    };

    // Cập nhập màu background và âm thanh thanh volume khi user điều chỉnh thanh volume
    volume.oninput = function (e) {
      const value = e.target.value;
      _this.updateRangeBackground(this, value);
      audio.volume = value / 100;
      _this.setConfig("volumeValue", audio.volume);

      // Logic xử lí thay đôi icon volume
      _this.updateVolumeIcon(audio.volume);
    };

    // Khi click vào volume
    volumeContainer.onclick = function (e) {
      if (!_this.isMute) {
        // Tắt âm thanh
        audio.volume = 0;
        volume.value = 0;
        _this.updateRangeBackground(volume, 0);
        _this.isMute = true;
        _this.setConfig("isMute", _this.isMute);

        // Hiện thỉ icon xmark
        offVolume.style.display = "none";
        low.style.display = "none";
        highVolume.style.display = "none";
        xmarkVolume.style.display = "block";
      } else {
        const oldVolume = _this.config.volumeValue || 1;
        audio.volume = oldVolume;
        volume.value = oldVolume * 100;
        _this.updateRangeBackground(volume, volume.value);
        _this.isMute = false;
        _this.setConfig("isMute", _this.isMute);

        // Hiện thỉ lại icon đúng số mức của nó
        _this.updateVolumeIcon(audio.volume);
      }
    };

    // Khi next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Khi previous song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Xử lý bật / tắt random
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // Xử lý bật / tắt repeat
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // Xử lí next song khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else nextBtn.click();
    };

    // Lắng nghe hành vi click vào playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        // Xử lí khi click vào song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }

        // Xử lí khi click vào option
        if (e.target.closest(".option")) {
        }
      }
    };
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      if (
        this.currentIndex === 0 ||
        this.currentIndex === 1 ||
        this.currentIndex === 2
      ) {
        $(".song.active").scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      } else {
        $(".song.active").scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, 100);
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
    audio.src = this.currentSong.path;

    // Mỗi lần đổi bài thì lưu lại index
    this.setConfig("currentIndex", this.currentIndex);
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom || false;
    this.isRepeat = this.config.isRepeat || false;
    this.currentIndex = this.config.currentIndex || 0;

    // Load thanh progress
    if (this.config.currentTime) {
      audio.currentTime = this.config.currentTime;
      progress.style.background = this.config.progressBackground;
    }

    // Nếu chưa có volumeValue thì đặt mặc định 100%
    if (this.config.volumeValue === undefined) {
      this.config.volumeValue = 1;
      this.setConfig("volumeValue", 1);
    }

    // Load thanh volume
    if (this.config.volumeValue !== undefined) {
      audio.volume = this.config.volumeValue;
      volume.value = this.config.volumeValue * 100;
      this.updateRangeBackground(volume, volume.value);
      this.updateVolumeIcon(audio.volume);
    }
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  shuffleArray: function (array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  playRandomSong: function () {
    // Nếu shuffledList trống, shuffle lại toàn bộ
    if (this.shuffledList.length === 0) {
      this.shuffledList = this.shuffleArray([
        ...Array(this.songs.length).keys(), //tạo ra một iterator (bộ sinh) gồm các chỉ số từ 0 đến length-1.
      ]); //[0,1,2...]
    }

    // Đảm bảo bài đầu tiên không trùng với currentIndex
    if (this.shuffledList[0] === this.currentIndex) {
      [this.shuffledList[0], this.shuffledList[1]] = [
        this.shuffledList[1],
        this.shuffledList[0],
      ];
    }

    // Lấy 1 bài từ shuffledList
    this.currentIndex = this.shuffledList.shift();
    this.loadCurrentSong();
  },
  start: function () {
    // Load config
    this.loadConfig();

    // Định nghĩa các thuộc tính cho object
    this.defineProperties();

    // Lắng nghe và xử lí các sự kiện
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    // Render playlist
    this.render();

    // Hiển thị trạng thái ban đàu của button repeat và random
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};

app.start();
