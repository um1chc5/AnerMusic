const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $('.playlist');
const cdThumb = $('.cd-thumb');
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const audio = $('#audio')
const progressBar = $('input.progress')
var playNum = 0


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'In The End',
            singer:'Linkin Park',
            path: './data/In The End - Linkin Park.mp3',
            image: './data/intheend.jpg'
        },
        {
            name: 'A Sky Full Of Stars',
            singer:'Coldplay',
            path: './data/A Sky Full Of Stars - Coldplay.mp3',
            image: './data/askyfullofstars.jpg'
        },
        {
            name: 'Fix You',
            singer:'Coldplay',
            path: './data/Fix You - Coldplay.mp3',
            image: './data/fixyou.png'
        },
        {
            name: 'Flight',
            singer:'Hans Zimmer',
            path: './data/Flight-HansZimmer-2636297.mp3',
            image: './data/manofsteel.jpg'
        },
        {
            name: 'New Divide',
            singer:'Linkin Park',
            path: './data/newdivide.mp3',
            image: './data/newdivide.jpg'
        },
        {
            name: 'One Step Closer',
            singer:'Linkin Park',
            path: './data/One Step Closer - Linkin Park.mp3',
            image: './data/onestepcloser.jpg'
        },
        {
            name: 'Rises',
            singer:'Hans Zimmer',
            path: './data/RiseTheDarkKnightRisesOst-HansZi_443ms.mp3',
            image: './data/rise.jpg'
        },
        {
            name: 'Shadow Of The Day',
            singer:'Linkin Park',
            path: './data/Shadow Of The Day - Linkin Park.mp3',
            image: './data/shadowoftheday.jpeg'
        },
        {
            name: 'Somewhere I Belong',
            singer:'Linkin Park',
            path: './data/somewhere.mp3',
            image: './data/Linkin_Park_Meteora_Album_Cover.jpg'
        },
        {
            name: 'Tầng Thượng 102',
            singer:'Linkin Park',
            path: './data/Tang Thuong 102 - Ca Hoi Hoang.mp3',
            image: './data/cahoihoang.jpg'
        }
    ],

    start: function() {
        this.render(),
        this.loadCurrentSong(),
        this.handleEvents()
    },

    //Load danh sách bài hát
    render: function() {
        var playlistContent = this.songs.map((song, index) => {
            return `<div class="song ${index == 0? 'active' : ''}" data-index=${index}>
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="song-body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
        }).join('')
        playlist.innerHTML = playlistContent
    },

    //Load Bài hát hiện tại

    loadCurrentSong: function() {
        var currentSong = this.songs[this.currentIndex]
        cdThumb.style.backgroundImage = `url(${currentSong.image})`
        $('header h2').innerHTML = currentSong.name
        audio.src = currentSong.path
        if (playNum != 0) {$('.song.active').classList.remove('active')}
        playNum += 1  
    },

    handleEvents: function() {
            // Đặt biến cần thiết
            const songsTotal = this.songs.length

            //Thay đổi chiều cao
            var currentHeight = cdThumb.offsetHeight
            document.onscroll = function() {
                var scrollDistance = window.scrollY;
                var newHeight = currentHeight - scrollDistance*0.75;
                if (newHeight < 0) {
                    cd.style.width = '0px';
                } else {
                    cd.style.width = newHeight + 'px';
                }
            }

            //Làm đĩa quay
            const CDrotate = cdThumb.animate([
                {transform: 'rotate(360deg)'}
            ],  {
                    duration: 10000,
                    iterations: Infinity
                }
            )
            CDrotate.pause()

            // Xử lý các thao tác khi nhạc chạy như làm đĩa xoay và làm màu đỏ
            audio.onplay = () => {
                CDrotate.play()
                currentSong = songDiv[this.currentIndex]
                currentSong.scrollIntoView({behavior: 'smooth', block: 'center'})
                currentSong.parentNode.classList.add('active') // Thêm nền màu hồng
            }
            audio.onpause = () => {CDrotate.pause()}
            
            //Phát nhạc
            playBtn.onclick = function() {

                app.isPlaying = !app.isPlaying;
                if (app.isPlaying) {
                    audio.play()
                } else {
                    audio.pause()
                }
        
                $('.fa-play').classList.toggle('playing', app.isPlaying)
                $('.fa-pause').classList.toggle('playing', app.isPlaying)
            }  

            //Next bài
            nextBtn.onclick = () => {
                if (!this.isRandom) {
                    this.currentIndex == songsTotal - 1 ? this.currentIndex = 0 : this.currentIndex += 1
                } else {
                    randomSong()
                }

                this.loadCurrentSong()
                this.isPlaying ? audio.play() : playBtn.click()
            }

            //Lùi bài
            prevBtn.onclick = () => {

                if (!this.isRandom) {
                    this.currentIndex == 0 ? this.currentIndex = songsTotal - 1 : this.currentIndex -= 1
                } else {
                    randomSong()
                }
                this.loadCurrentSong()
                this.isPlaying ? audio.play() : playBtn.click()
            }

            //Random bài
            randomBtn.onclick = () => {
                this.isRandom = !this.isRandom
                randomBtn.classList.toggle('active')
            }

            //Mình để dưới đây để thể hiện rằng các DOM Events chạy/hoisted sau các expression function nên vẫn có thể trả về giá trị
            // Nếu khai báo hàm này bằng dạng declared thì khi ấn chuyển bài sẽ không có tác dụng và currentIndex vẫn sẽ lại bài đang phát, không biết vì sao huhu
            const randomSong = () => {
                newIndex = this.currentIndex
                do {    
                    newIndex = Math.floor(Math.random()*songsTotal)
                } while (newIndex == this.currentIndex)
                this.currentIndex = newIndex
                //console.log(this.currentIndex)
            }

            //Repeat bài
            repeatBtn.onclick = () => {
                this.isRepeat = !this.isRepeat
                repeatBtn.classList.toggle('active')
                // console.log(this.isRepeat)
            }
            

            //handle sự kiện tua bài
            progressBar.oninput = () => {
                newTime = audio.duration*progressBar.value/100
                audio.currentTime = newTime
            }

            //Handle sự kiện phát nhạc thanh Progress(Chạy thanh progress, tự chuyển khi hết bài)
            audio.ontimeupdate = () => {
                if (audio.duration) {
                    var current_time = audio.currentTime
                    var duration = audio.duration
                    progressBar.value = 100*current_time/duration
                } 
            }
            
            //Tự động chuyển bài khi kết thúc
            audio.onended = () => {
                if (this.isRandom) {
                    randomSong()
                } else {
                    this.isRepeat ? app.currentIndex += 0 : app.currentIndex += 1
                }
                app.loadCurrentSong()
                audio.play()
            } 


            //Ấn vào bài thì nó chuyển sang bài đó, và chuyển màu nền của bài
            
            const songDiv = document.querySelectorAll('.song-body') //Phải khai báo ở đây vì danh sách bài hát được render sau
            songDiv.forEach(e => {
                e.onclick = () => {
                    this.currentIndex = parseInt(e.parentNode.dataset.index)
                    if (!this.isPlaying) {  
                        this.loadCurrentSong()
                        playBtn.click()
                    } else {
                        this.loadCurrentSong()
                        audio.play()
                    }                 
                }
            })


    },



}

app.start()

