const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");

const app = {
  currentIndex: 0,
  isPlaying: false,
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
      image: "./assets/img/Nevada.jpg",
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
      name: "Monster",
      singer: "Katie sky",
      path: "./assets/music/Monster.mp3",
      image: "./assets/img/Monster.jpg",
    },
  ],
  render: function () {
    const htmls = this.songs.map((song) => {
      return `<div class="song">
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
    $(".playlist").innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

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
    };

    // Khi song bị paused
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
    };
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
    audio.src = this.currentSong.path;
  },
  start: function () {
    // Định nghĩa các thuộc tính cho object
    this.defineProperties();

    // Lắng nghe và xử lí các sự kiện
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    // Render playlist
    this.render();
  },
};

app.start();
