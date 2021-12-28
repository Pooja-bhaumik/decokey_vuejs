<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-dialog v-model="show" persistent hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-container fluid>
              <v-row>
                  <v-col cols="4">
                      <v-file-input v-model="fileForUpload" accept="image/*" label="Upload file"></v-file-input>
                  </v-col>
                  <v-col cols="4">
                      <v-btn color="primary" v-if="fileForUpload" @click="uploadFile">Upload</v-btn>
                  </v-col>
              </v-row>
              <v-row dense>
                  <v-col
                          v-for="imageUrl in imageUrls"
                          :key="imageUrl"
                          class="d-flex child-flex"
                          cols="4"
                  >
                      <v-card flat tile class="d-flex">
                          <v-img
                                  :src="imageUrl"
                                  :lazy-src="imageUrl"
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
                                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                  </v-row>
                              </template>
                          </v-img>
                          <v-card-actions>
                              <v-btn icon>
                                <v-icon @click="handleSelectImage(imageUrl)" v-text="'mdi-check-bold'"></v-icon>
                              </v-btn>
                              <v-btn v-if="!isOverview" icon>
                                <v-icon @click="deleteImage(imageUrl)" v-text="'mdi-delete'"></v-icon>
                              </v-btn>
                          </v-card-actions>
                      </v-card>
                  </v-col>
              </v-row>
          </v-container>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="handleSelectImage()">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>

export default {
  props: [ 'show', 'isOverview' ],
  data: () => ({
    fileForUpload: null
  }),
  computed: {
    imageUrls () {
      if (this.isOverview) {
        return this.$store.getters.listAdBannerOverviewFiles
      }
      return this.$store.getters.listAdBannerUserFiles
    }
  },
  watch: {
    show: {
      handler: function (v, o) {
        if (v) {
          this.loadImages()
        }
      }
    }
  },
  methods: {
    uploadFile () {
      if (this.isOverview) {
        this.$store.dispatch('uploadAdBannerOverview', this.fileForUpload).done(() => {
          this.loadImages()
          this.fileForUpload = null
        })
      } else {
        this.$store.dispatch('uploadAdBannerImage', this.fileForUpload).done(() => {
          this.loadImages()
          this.fileForUpload = null
        })
      }
    },
    handleSelectImage (imageUrl) {
      this.$emit('imageSelected', imageUrl)
    },
    loadImages () {
      if (this.isOverview) {
        this.$store.dispatch('loadAdBannerOverview')
      } else {
        this.$store.dispatch('loadAdBannerUserFiles')
      }
    },
    deleteImage (imageUrl) {
      this.$store.dispatch('deleteAdBannerUserImage', imageUrl).done(() => { this.loadImages() })
    }
  }

}
</script>
