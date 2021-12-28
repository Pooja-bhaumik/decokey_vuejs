<template xmlns:v-slot="http://www.w3.org/1999/colsL/Transform">
  <v-container fluid>
        <confirm-dialog ref="confirmDialog"></confirm-dialog>
        <v-row v-resize="onResize" :dense="isUploadIcon">
            <v-col sm="10" cols="11" align-self="center">
                <v-file-input
                    :disabled="!cmsContentItemId"
                    v-model="fileForUpload"
                    accept="image/*"
                    label="Upload file"
                    append-icon="mdi-magnify"
                    prepend-icon=""
                ></v-file-input>
            </v-col>
            <v-col sm="2" cols="1" align-self="center">
                <v-icon v-if="isUploadIcon" v-text="'mdi-upload'" @click="uploadImage" large></v-icon>
                <v-btn v-else color="primary" :disabled="!fileForUpload" @click="uploadImage" outlined block>Upload</v-btn>
            </v-col>
        </v-row>
        <v-row v-if="imageUrls && imageUrls.length">
            <v-col cols="12" class="pt-0">
                <span class="headline">All images</span>
            </v-col>
        </v-row>
        <v-row v-else>
            <v-col cols="12" class="pt-0">
                <span class="headline">No uploaded images</span>
            </v-col>
        </v-row>
        <v-row v-if="!cmsContentItemId">
            <v-col cols="12" class="pt-0">
                <span style="color:red; font-size: medium">Please save this Content item first, in order to be able to upload images.</span>
            </v-col>
        </v-row>
        <v-row
            dense
            style="border-top: 1px solid #d3d3d3"
            v-for="imageUrl in imageUrls"
            :key="imageUrl"
        >
            <v-col
                class="d-flex child-flex"
                lg="7"
                md="7"
                sm="6"
                cols="12"
            >
                <v-img
                  :src="imageUrl"
                  :lazy-src="imageUrl"
                  alt="Image"
                  aspect-ratio="1"
                  max-height="300"
                  max-width="300"
                  class="white--text align-end"
                  @click="handleSelectImage(imageUrl)"
                >
                  <v-card-title>{{imageUrl.substr(imageUrl.lastIndexOf("/")+1)}}</v-card-title>
                  <template v-slot:placeholder>
                      <v-row
                          class="fill-height ma-0"
                          align="center"
                          justify="center"
                      >
                          <v-progress-circular indeterminate color="grey lighten-3"></v-progress-circular>
                      </v-row>
                  </template>
                  <v-btn class="btn-sm" color="danger" @click.stop="deleteCmsContentItemImage(imageUrl)" block>Delete image</v-btn>
                </v-img>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import ConfirmDialog from '@/components/ConfirmDialog'

export default {
  props: ['cmsContentItemId', 'isVisible'],
  data: () => ({
    fileForUpload: null,
    isUploadIcon: false,
    imageUrls: []
  }),
  watch: {
    isVisible: {
      handler: function (newValue) {
        if (newValue) {
          this.loadImages()
        }
      }
    }
  },
  methods: {
    loadImages () {
      if (this.cmsContentItemId) {
        this.$store.dispatch('loadCmsContentItemImages', this.cmsContentItemId).then(urls => {
          this.imageUrls = urls
        })
      }
    },
    uploadImage () {
      this.$store.dispatch('uploadCmsContentItemImage', {
        file: this.fileForUpload,
        cmsContentItemId: this.cmsContentItemId
      }).done((response) => {
        this.loadImages()
        this.fileForUpload = null
      }).fail(err => {
        console.log(err)
      })
    },
    onResize () {
      if (window.innerWidth < 600) {
        this.isUploadIcon = true
      } else {
        this.isUploadIcon = false
      }
    },
    handleSelectImage (imageUrl) {
      this.$emit('imageSelected', imageUrl)
    },
    deleteCmsContentItemImage (imageUrl) {
      this.$store.dispatch('deleteCmsContentItemImage', {
        imageUrl: imageUrl,
        cmsContentItemId: this.cmsContentItemId
      }).done((response) => {
        this.loadImages()
      }).fail(err => {
        console.log(err)
      })
    }
  },
  mounted () {
    this.onResize()
    this.loadImages()
  },

  components: {
    ConfirmDialog
  }
}
</script>
