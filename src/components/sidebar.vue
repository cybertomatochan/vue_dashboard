<template>
  <div>
    <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div class="sidebar-sticky pt-3">
        <h6
          class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
        >
          <span>管理員</span>
        </h6>
        <ul class="nav flex-column">
          <li class="nav-item" @click="link = 'product'">
            <router-link
              to="/admin/products"
              class="nav-link"
              :class="{ active: link == 'product' }"
            >
              產品列表
            </router-link>
          </li>

          <li class="nav-item" @click="link = 'order'">
            <router-link
              to="/admin/order"
              class="nav-link"
              :class="{ active: link == 'order' }"
            >
              訂單列表
            </router-link>
          </li>
          <li class="nav-item" @click="link = 'coupon'">
            <router-link
              to="/admin/coupon"
              class="nav-link"
              :class="{ active: link == 'coupon' }"
            >
              優惠券
            </router-link>
          </li>
        </ul>

        <h6
          class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
        >
          <span>模擬功能</span>
        </h6>
        <ul class="nav flex-column mb-2">
          <li class="nav-item" @click="link = 'custom'">
            <router-link
              to="/admin/custom"
              class="nav-link"
              :class="{ active: link == 'custom' }"
            >
              模擬訂單
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {
      link: "",
    };
  },
};
</script>
