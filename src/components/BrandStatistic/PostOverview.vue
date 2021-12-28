<template>
  <div>
    <template v-if="allPosts.length < 1">
      <p>No Posts Available</p>
      <div class="wrapper">
        <div class="section2">
          <div class="sidebar">
            <h2 style="text-align:center;margin-top:80px">Filter</h2>
            <div class="filters">
              <div class="first-Filter">
                <div class="select_filer">
                  <form>
                    <label>Type</label><br />
                    <select>
                      <option>All (default)</option>
                      <option>Post</option>
                      <option>Promotion</option>
                    </select>
                    <label>Network</label><br />
                    <select @change="handleChooseNetwork($event)">
                      <option value="ALL">All (default)</option>
                      <option value="FACEBOOK">Facebook</option>
                      <option value="INSTAGRAM">Instagram</option>
                    </select>
                  </form>
                </div>
                <div class="select_filer">
                  <label for="order_by">Post Categories</label>
                  <select @change="SortPostChange($event)">
                    <option value="New">Newest to Oldest</option>
                    <option value="Old">Oldest to new</option>
                  </select>
                </div>
                <div class="select_filer">
                  <label for="Items">No. of items</label><br />
                  <select @change="ChooseNumOfPost($event)">
                    <option value="2">2</option>
                    <option value="5">5</option>
                    <option value="7">7</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="wrapper">
        <div class="section2">
          <div class="sidebar">
            <h2 style="text-align:center;margin-top:80px">Filter</h2>
            <div class="filters">
              <div class="first-Filter">
                <div class="select_filer">
                  <form>
                    <label>Type</label><br />
                    <select>
                      <option>All (default)</option>
                      <option>Post</option>
                      <option>Promotion</option>
                    </select>
                    <label>Network</label><br />
                    <select @change="handleChooseNetwork($event)">
                      <option value="ALL">All (default)</option>
                      <option value="FACEBOOK">Facebook</option>
                      <option value="INSTAGRAM">Instagram</option>
                    </select>
                  </form>
                </div>
                <div class="select_filer">
                  <label for="order_by">Post Categories</label>
                  <select @change="SortPostChange($event)">
                    <option value="New">Newest to Oldest</option>
                    <option value="Old">Oldest to new</option>
                  </select>
                </div>
                <div class="select_filer">
                  <label for="Items">No. of items</label><br />
                  <select @change="ChooseNumOfPost($event)">
                    <option value="2">2</option>
                    <option value="5">5</option>
                    <option value="7">7</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="section1">
          <div class="main-content">
            <div class="center-line">
              <a href="#" class="scroll-icon"
                ><i class="fas fa-caret-up"></i
              ></a>
            </div>
            <span @click="moveUp" class="scrollTop">TOP</span>
            <PostOverviewSection
              v-for="(post, index) in allPosts"
              :key="post.id"
              :post="post"
              :flag="index"
            />
            <!-- <infinite-loading
            v-if="posts.length"
            spinner="spiral"
            @infinite="scrollHandler"
          ></infinite-loading> -->
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import PostOverviewSection from './PostOverviewSection'
// import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'PostOverview',
  components: {
    PostOverviewSection
    // InfiniteLoading
  },
  // data: function () {
  //   return {
  //     posts: [],
  //     page: 0
  //   }
  // },
  props: {
    allPosts: Array,
    handleChooseNetwork: Function,
    SortPostChange: Function,
    ChooseNumOfPost: Function
  },
  // watch: {
  //   allPosts () {
  //     console.log('All Posts::::::', this.allPosts)
  //     const initialPosts = this.allPosts.slice(0, 2)
  //     console.log('Initial Posts:::::::: ', initialPosts)
  //     this.posts.push(...initialPosts)
  //     this.page = 2
  //   }
  // },
  methods: {
    moveUp () {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    }
    // getNextPosts () {
    //   return new Promise(resolve => {
    //     let res = []
    //     if (this.page < this.allPosts.length - 1) {
    //       for (let i = 0; i < 2; i++) {
    //         res.push(this.allPosts[this.page])
    //         this.page++
    //       }
    //     }
    //     resolve(res)
    //   })
    // },
    // scrollHandler ($state) {
    //   setTimeout(async () => {
    //     const newPosts = await this.getNextPosts()
    //     console.log('New Posts::::', newPosts)
    //     if (newPosts.length > 1) {
    //       this.posts.push(...newPosts)
    //       $state.loaded()
    //     } else {
    //       console.log('Else block executed...')
    //       $state.complete()
    //     }
    //     this.loading = false
    //   }, 2000)
    // }
  }
}
</script>
<style scoped>
.select_filer {
  margin-top: 20px;
}
.select_filer label {
  font-size: 14px;
}

.scrollTop {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background-color: #f2f2f2;
  cursor: pointer;
  position: fixed;
  left: 70%;
  bottom: 3%;
  box-shadow: 10px 12px 38px 9px rgba(0, 0, 0, 0.36);
  animation: blink 1s linear infinite;
}

@keyframes blink {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}
html {
  scroll-behavior: smooth;
}
body {
  background: #019aff;
}
::selection {
  color: #fff;
  background: #6433c3;
}
.main-content {
  max-width: 1080px;
  margin: 50px auto;
  padding: 0 20px;
  position: relative;
}
.main-content .center-line {
  position: absolute;
  height: 100%;
  width: 4px;
  background: #7cbcff;
  left: 50%;
  top: 20px;
  transform: translateX(-50%);
}
.main-content .row {
  display: flex;
}
.main-content .row-1 {
  justify-content: flex-start;
}
.main-content .row-2 {
  justify-content: flex-end;
}
.main-content .row section {
  background: #ededed;
  border-radius: 5px;
  width: calc(50% - 40px);
  padding: 20px;
  position: relative;
}
.main-content .row section::before {
  position: absolute;
  content: "";
  height: 15px;
  width: 15px;
  background: #fff;
  top: 28px;
  z-index: -1;
  transform: rotate(45deg);
}

span.date-right {
  position: absolute;
  right: -200px;
  top: 15px;
  color: #6433c3;
  font-weight: 500;
  background: white;
  border-radius: 5px;
  padding: 7px 14px;
}

.main-content .row-1:hover > section {
  background: #6433c3;
  color: white;
}
.main-content .row-2:hover > section {
  background: #6433c3;
  color: white;
}

span.date-left {
  position: absolute;
  left: -200px;
  top: 15px;
  color: #6433c3;
  font-weight: 500;
  background: white;
  border-radius: 5px;
  padding: 7px;
}

.main-content .row-2:hover > section span.date-left {
  color: #fff;
  background: #6433c3;
}

.main-content .row-1:hover > section span.date-right {
  color: #fff;
  background: #6433c3;
}

span.dateForMobile {
  display: none;
}

.main-content img {
  width: 100%;
}
.row-1 section::before {
  right: -7px;
}
.row-2 section::before {
  left: -7px;
}
.row section .icon,
.center-line .scroll-icon {
  position: absolute;
  background: #f2f2f2;
  height: 40px;
  width: 40px;
  text-align: center;
  line-height: 40px;
  border-radius: 50%;
  color: #00087a;
  font-size: 17px;
  box-shadow: 0 0 0 4px #fff, inset 0 2px 0 rgba(0, 0, 0, 0.08),
    0 3px 0 4px rgba(0, 0, 0, 0.05);
}
.center-line .scroll-icon {
  bottom: 0px;
  left: 50%;
  font-size: 25px;
  transform: translateX(-50%);
}
.row-1 section .icon {
  top: 15px;
  right: -60px;
}
.row-2 section .icon {
  top: 15px;
  left: -60px;
}
.row section .details,
.row section .bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.row section .details .title {
  font-size: 22px;
  font-weight: 600;
}
.row section p {
  margin: 10px 0 17px 0;
}
.row section .bottom a {
  text-decoration: none;
  background: #6433c3;
  color: #fff;
  padding: 7px 15px;
  border-radius: 5px;
  font-weight: 400;
  transition: all 0.3s ease;
}

.row section .bottom a:hover {
  transform: scale(0.97);
}

.wrapper {
  display: grid;
}

.main-content {
  margin-right: 350px;
}
.sidebar {
  position: fixed;
  right: 0;
  top: 0;
  width: 350px;
  background-color: white;
}

.first-Filter {
  background: #2ab6f6;
  padding: 10px;
  text-align: left;
  border-radius: 8px;
  margin: 10px;
  color: white;
}

.first-Filter select {
  border: 0px solid #ffffff;
  border-radius: 5px;
  font-size: 16px;
  padding: 2px;
  margin: 10px;
  width: 90%;
  box-shadow: 5px 5px 0px 0px rgba(255, 255, 255, 0.75);
  color: #3e3e3e;
  outline: none;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #00087a;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

@media (max-width: 790px) {
  span.date-right {
    display: none !important;
  }

  span.date-left {
    display: none !important;
  }

  .first-Filter {
    padding: 10px;
    text-align: left;
    border-radius: 0px;
    margin: 0px;
    color: white;
  }

  .select_filer {
    margin-top: 0px;
  }
  span.dateForMobile {
    display: block;
  }
  .main-content {
    width: auto;
    margin-right: 0px;
  }

  .main-content .center-line {
    left: 40px;
  }
  .main-content .row {
    margin: 30px 0 3px 60px;
  }
  .main-content .row section {
    width: 100%;
  }
  .row-1 section::before {
    left: -7px;
  }
  .row-1 section .icon {
    left: -60px;
  }

  .sidebar {
    position: static;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    background-color: white;
  }
}
@media (max-width: 440px) {
  .main-content .center-line,
  .row section::before,
  .row section .icon {
    display: none;
  }
  .main-content .row {
    margin: 10px 0;
  }
}
</style>
