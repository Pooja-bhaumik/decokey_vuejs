<template>
  <div class="product_group_list">
    <div class="product_group_list_item">
      <v-menu>
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark v-on="on" class="btn">
            Product Groups
          </v-btn>
        </template>
        <v-list v-if="allProductsGroups.length > 0">
          <v-list-item
            @click="
              handleToggle(1);
              graphDataHandler(productGroup.product_group_id);
            "
            v-for="productGroup in allProductsGroups"
            :key="productGroup.product_group_id"
          >
            <v-list-item-title>{{
              productGroup.product_name
            }}</v-list-item-title>
          </v-list-item>
        </v-list>
        <v-list v-else>
          <v-list-item>
            <v-list-item-title style="color:red"
              >Product Groups Not Found.</v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ProductGroupsList.vue',
  props: {
    handleToggle: Function,
    allProductsGroups: Array,
    graphDataHandler: Function
  }
}
</script>
<style scoped>
.product_group_list_item {
  position: absolute;
  z-index: 6;
  width: 200px;
  right: 112px;
  top: 16%;
  list-style: none;
  padding: 0px;
}
.btn {
  font-weight: 500;
  font-size: 15px;
  background: #e4f5fd !important;
  text-transform: capitalize;
}
</style>
