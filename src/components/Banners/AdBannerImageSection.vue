<template xmlns:v-slot="http://www.w3.org/1999/colsL/Transform">
    <div>
        <confirm-dialog ref="confirmDialog"></confirm-dialog>
        <v-row v-resize="onResize" :dense="isUploadIcon">
            <v-col sm="10" cols="11" align-self="center">
                <v-file-input
                    :disabled="!adBannerId"
                    v-model="fileForUpload"
                    accept="image/*"
                    :label="title"
                    append-icon="mdi-magnify"
                    prepend-icon=""
                ></v-file-input>
            </v-col>
            <v-col sm="2" cols="1" align-self="center">
                <v-icon v-if="isUploadIcon" v-text="'mdi-upload'" @click="uploadImage" large></v-icon>
                <v-btn v-else color="primary" :disabled="!fileForUpload" @click="uploadImage" outlined block>Upload</v-btn>
            </v-col>
        </v-row>
        <v-row v-if="images && images.length">
            <v-col cols="12" class="pt-0">
                <span class="headline">All images</span>
            </v-col>
        </v-row>
        <v-row v-if="!adBannerId">
            <v-col cols="12" class="pt-0">
                <span style="color:red; font-size: medium">Please save this Ad Banner Set first, in order to be able to upload images.</span>
            </v-col>
        </v-row>
        <v-row
            dense
            style="border-top: 1px solid #d3d3d3"
            v-for="image in images"
            :key="image.url"
        >
            <v-col
                class="d-flex child-flex"
                lg="7"
                md="7"
                sm="6"
                cols="12"
            >
                <v-img
                  :src="image.url"
                  :lazy-src="image.url"
                  alt="Image"
                  aspect-ratio="1"
                  max-height="300"
                  max-width="300"
                  class="white--text align-end"
                  @click="handleSelectImage(image.url)"
                >
                  <v-card-title>{{image.url.substr(image.url.lastIndexOf("/")+1)}}</v-card-title>
                  <template v-slot:placeholder>
                      <v-row
                          class="fill-height ma-0"
                          align="center"
                          justify="center"
                      >
                          <v-progress-circular indeterminate color="grey lighten-3"></v-progress-circular>
                      </v-row>
                  </template>
                </v-img>
            </v-col>
            <v-col v-if="!isOverview" lg="5" md="5" sm="6" cols="12">
              <v-row>
                <v-col sm="12" cols="12">
                  <v-select
                    v-model="image.style"
                    :items="imageStylesVariants"
                    label="Select style"
                    class="mb-4"
                    dense
                    outlined
                    hide-details
                  ></v-select>
                  <v-btn
                    block
                    outlined
                    color="primary"
                    @click="changeImageActivity(image)"
                  >
                    {{ image.active ? 'Deactivate item' : 'Activate item' }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
            <v-col v-else-if="deletable" lg="5" md="5" sm="6" cols="12">
              <v-row>
                <v-col sm="12" cols="12">
                  <v-btn
                      block
                      outlined
                      color="primary"
                      @click="$emit('deleteImage', image)"
                  >
                    Delete image
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import ConfirmDialog from '@/components/ConfirmDialog'

export default {
  props: {
    images: {
      type: Array,
      required: true
    },
    adBannerId: {
      required: true
    },
    isOverview: {
      type: Boolean,
      required: false,
      default: false
    },
    title: {
      type: String,
      required: false,
      default: 'Upload file'
    },
    deletable: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: () => ({
    fileForUpload: null,
    imageStylesVariants: [
      { text: 'style1', value: 'width1 height1' },
      { text: 'style2', value: 'width2 height1' },
      { text: 'style3', value: 'width1 height2' },
      { text: 'style4', value: 'width2 height2' }
    ],
    isUploadIcon: false
  }),

  watch: {
    images () {
      this.fileForUpload = null
    }
  },

  methods: {
    changeImageActivity (image) {
      let stateMessage = image.active ? 'deactivate' : 'activate'
      this.$refs.confirmDialog.open('Change activity', `Are you sure to ${stateMessage} this image?`).then(confirm => {
        if (confirm) {
          image.active = !image.active
          this.$emit('changedImageActivity')
        }
      })
    },

    uploadImage () {
      this.$emit('uploadNewImage', this.fileForUpload)
      this.fileForUpload = null
    },

    onResize () {
      if (window.innerWidth < 600) {
        this.isUploadIcon = true
      } else {
        this.isUploadIcon = false
      }
    }
  },

  mounted () {
    this.onResize()
  },

  components: {
    ConfirmDialog
  }
}
</script>
