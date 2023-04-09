// Импортируйте зависимости
const { createApp } = Vue;
const { gsap } = window;
const axios = window.axios;

const app = createApp({
  data() {
    return {
      shopItems: [],
      cartItems: [],
    };
  },
  created() {
    axios
      .get("https://s3-us-west-2.amazonaws.com/s.cdpn.io/1315882/shoes.json")
      .then((res) => {
        this.shopItems = res.data.shoes;
      });
  },
  methods: {
    addToCart(item) {
      if (!item.inCart) {
        item.inCart = true;
        const newItem = Object.assign({}, item, { count: 1 });
        this.$data.cartItems.push(newItem);

        const animationTarget = this.$refs[`addButton${item.id}`];
        gsap.to(animationTarget, {
          width: 46,
          duration: 0.8,
          ease: "power4",
        });

        // Добавлено: вызов анимации
      this.$nextTick(() => {
  this.playCartAnimation(item.id);
});
      }
      this.$nextTick(() => {
        this.$refs.cartItems.scrollTop = this.$refs.cartItems.scrollHeight;
      });
    },

    decrement(item) {
      item.count--;
      const targetShopItem = this.$data.shopItems.find(
        (shopItem) => shopItem.id === item.id
      );

      this.$nextTick(function () {
        if (item.count === 0) {
          const animationTarget = this.$refs[`addButton${targetShopItem.id}`];
          gsap.to(animationTarget, {
            width: 136,
            duration: 0.8,
            ease: "power4",
          });
          targetShopItem.inCart = false;
          const targetIndex = this.$data.cartItems.findIndex(
            (cartItem) => cartItem.id === item.id
          );
          this.$data.cartItems.splice(targetIndex, 1);
        }
      });
    },

    increment(item) {
      item.count++;
    },

playCartAnimation(itemId) {
  const tl = gsap.timeline({ paused: true });

  tl.add(
    gsap.from(this.$refs[`cartImageWrapper${itemId}`], {
      duration: 0.5,
      scale: 0,
      ease: "power4",
    })
  );

  tl.add(
    gsap.from(this.$refs[`cartImageShoe${itemId}`], {
      duration: 0.5,
      scale: 0,
      ease: "power4",
    }),
    "-=0.25"
  );

  tl.add(
    gsap.from(
      [
        this.$refs[`cartText${itemId}`],
        this.$refs[`cartPrice${itemId}`],
      ],
      {
        duration: 0.5,
        x: 30,
        opacity: 0,
        stagger: 0.15,
        ease: "power4",
      }
    ),
    "-=0.25"
  );

  tl.play();
},
  },
});

// Здесь подключаем наше приложение к элементу с идентификатором 'app'
app.mount("#app");
