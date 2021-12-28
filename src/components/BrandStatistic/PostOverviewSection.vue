<template>
  <div :class="` row ${flag % 2 === 0 ? 'row-1' : 'row-2'}`">
    <section>
      <i class="icon fas fa-home"></i>
      <img :src="post.post_image" style="width:100%" />
      <div class="details">
        <span class="title"></span>
        <span class="dateForMobile"></span>
      </div>
      <p>
        {{ post.description }}
      </p>
      <div class="bottom">
        <a :href="`https://www.facebook.com/${post.post_id}`" target="_blank"
          >Read more</a
        >
      </div>
      <p style="display:inline-block">Engage User : {{ post.engaged_user }}</p>
      <p style="display:inline-block ; margin-left:10px">
        Impression : {{ post.impression }}
      </p>
      <span :class="`${flag % 2 === 0 ? 'date-left' : 'date-right'}`">{{
        post.post_date
      }}</span>
    </section>
  </div>
</template>
<script>
export default {
  name: 'PostOverviewSection',
  props: {
    post: Object,
    flag: Number
  }
}
</script>
<style scoped>
.row {
  display: flex;
  padding: 0.5rem 0px;
}
.row-1 {
  justify-content: flex-start;
}
.row-2 {
  justify-content: flex-end;
}

.row section {
  background: #ededed;
  border-radius: 5px;
  width: calc(50% - 40px);
  padding: 14px;
  position: relative;
}
.row section::before {
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
  left: -203px;
  top: 15px;
  color: #6433c3;
  font-weight: 500;
  background: white;
  border-radius: 5px;
  padding: 7px 14px;
}

section:hover {
  background: #6433c3;
  color: white;
  transition: 0.3s;
}
section:hover {
  background: #6433c3;
  color: white;
  transition: 0.3s;
}

span.date-left {
  position: absolute;
  right: -194px;
  top: 15px;
  color: #6433c3;
  font-weight: 500;
  background: white;
  border-radius: 5px;
  padding: 7px;
}

section:hover span.date-left {
  color: #fff !important;
  background: #6433c3;
}

section:hover span.date-right {
  color: #fff;
  background: #6433c3;
}

span.dateForMobile {
  display: none;
}
style img {
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
  height: 40px;
  width: 40px;
  text-align: center;
  line-height: 40px;
  border-radius: 50%;
  color: #00087a;
  background: #00a1ff;
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
  top: -10px;
  right: -60px;
  background: #efefef;
}
.row-2 section .icon {
  top: 15px;
  left: -60px;
  background: #efefef;
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
  padding: 7px 11px;
  border-radius: 5px;
  font-weight: 400;
  transition: all 0.3s ease;
}
.row section .bottom a:hover {
  transform: scale(0.97);
}
@media (max-width: 790px) {
  span.date-right {
    display: none;
  }
  span.date-left {
    display: none;
  }
  span.dateForMobile {
    display: block;
  }
  .center-line {
    left: 40px;
  }
  .row {
    margin: 30px 0 3px 60px;
  }
  .row section {
    width: 100%;
  }
  .row-1 section::before {
    left: -7px;
  }
  .row-1 section .icon {
    left: -60px;
    background: #efefef;
  }
}
@media (max-width: 440px) {
  .center-line,
  .row section::before,
  .row section .icon {
    display: none;
  }
  .row {
    margin: 10px 0;
  }
}
</style>
