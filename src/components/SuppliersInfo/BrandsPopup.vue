<template>
  <v-dialog v-model="brandsPopupOn" max-width="800px">
    <v-card>
      <v-card-title class="text-center">
        <span class="headline font-weight-bold">Brands</span>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :loading="loading"
          :headers="headers"
          :items="brands"
          :hide-default-header="true"
          :page.sync="page"
          :options.sync="options"
          :server-items-length="totalContentItems"
          :items-per-page="itemsPerPage"
          :footer-props="{
            'items-per-page-options': [5, 10, 20, 30, 40, 50],
          }"
        >
          <template v-slot:header="props">
            <tr>
              <th
                v-for="header in headers"
                :key="header.text"
              >
                <v-text-field
                v-if="header.search"
                :label="header.text"
                append-icon="mdi-magnify"
                class="md-4"
                v-model="search[header.text]"
                @keyup.enter.native="searchContent"
                ></v-text-field>
              </th>
            </tr>
          </template>
          <template v-slot:item.logo="{ item }">
            <img style="max-width: 100px; max-height: 50px" v-bind:src="item.logo">
          </template>
          <template v-slot:item.selection="{ item }">
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-checkbox v-model="item.isActive" @click.stop="addBrand(item)" color="primary" class="mx-2" v-on="on"></v-checkbox>
                </template>
                <span>{{ $t('buttons.select') }}</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="brandsPopupOn = false">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click.stop="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    brandsPopup: Boolean,
    supplierBrands: Array,
    supplierId: Number
  },
  data: function () {
    return {
      loading: false,
      search: {},
      brands: [],
      headers: [
        { text: 'id', value: 'id', align: 'left', search: true },
        { text: 'name', value: 'name', align: 'left', search: true },
        { text: 'logo', value: 'logo', align: 'left', search: true },
        { text: 'selection', value: 'selection', align: 'center' }
      ],
      totalContentItems: 0,
      options: {},
      itemsPerPage: 5,
      page: 1,
      brandItems: []
    }
  },
  computed: {
    brandsPopupOn: {
      get () {
        return this.brandsPopup
      },
      set (isOpen) {
        this.$emit('update:brandsPopup', isOpen)
      }
    }
  },
  watch: {
    options: {
      handler () {
        var search = this.search
        Object.keys(search).forEach(key => search[key] === '' && delete search[key])
        this.loadBrandsList()
      },
      deep: true
    },
    brandsId (val) {
      this.supplierBrandsId = val
    },
    brandsPopup (isOpen) {
      if (isOpen) {
        Object.keys(this.search).forEach(searchName => {
          this.search[searchName] = ''
        })
        this.page = 1
        this.brandItems = []
        this.brands = []
        if (this.supplierBrands) {
          this.brandItems = this.supplierBrands.map(brand => {
            return brand
          })
        }
        this.loadBrandsList()
      }
    }
  },
  methods: {
    addBrand (item) {
      item.isActive = !item.isActive
      if (item.isActive) {
        let brandItem = {
          brandDescription: item.name,
          brandId: +item.id,
          brandSrcId: +item.srcId,
          supplierId: +this.supplierId || null
        }
        this.brandItems.push(brandItem)
      } else {
        this.brandItems = this.brandItems.filter(brand => {
          return +brand.brandId !== +item.id
        })
      }
    },

    save () {
      this.brandsPopupOn = false
      this.$emit('update:supplierBrands', this.brandItems)
    },

    searchContent () {
      this.page = 1
      this.loadBrandsList()
    },

    loadBrandsList () {
      var search = this.search
      this.loading = true
      Object.keys(search).forEach(
        (key) => search[key] === '' && delete search[key]
      )
      this.$store
        .dispatch('clientSearchContentItems', {
          typeName: 'Brand',
          search: search,
          fields: 'id, logo, name, srcId',
          limit: this.options.itemsPerPage,
          offset: (this.options.page - 1) * this.options.itemsPerPage
        })
        .then((data) => {
          this.loading = false
          data.content.forEach(brand => {
            let logoLink = brand.logo
            brand.logo = 'https://s3-eu-west-1.amazonaws.com/c2c1/decokay2015/files/' + logoLink
            brand.isActive = this.brandItems.some(brandItem => {
              return +brandItem.brandId === +brand.id
            })
          })
          this.brands = data.content
          this.totalContentItems = data.totalElements
        })
    }
  }
}
</script>
