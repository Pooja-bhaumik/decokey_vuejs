<template>
  <v-dialog v-model="visible" persistent transition="dialog-bottom-transition" max-width="850px" :scrollable="true">
  <v-card flat>
  <v-form ref="projectForm">
    <v-container mt-0 pt-0>
      <v-row dense>
        <v-col cols="12" sm="12" md="12">
          <v-text-field v-model="name" label="Name" :rules="[checkRequired]" required
                        @change="validate('projectForm')"/>
        </v-col>
        <v-col cols="12" sm="12" md="12">
          <v-text-field v-model="logo"
                        readonly
                        label="Logo"
                        append-outer-icon="mdi-file-document-edit-outline"
                        @click:append-outer="uploadFile = true"
          ></v-text-field>
        </v-col>
        <v-col cols="12" v-if="uploadFile">
          <v-col cols="12" class="pt-0" v-if="!projectId">
            <span style="color:red; font-size: medium">Please save this Project first, in order to be able to upload logo.</span>
          </v-col>
          <v-file-input v-else
                        v-model="fileToUpload"
                        accept="image/*"
                        label="Upload logo"
                        append-icon="mdi-magnify"
                        prepend-icon=""
                        append-outer-icon="mdi-upload"
                        @click:append-outer="upload"
          ></v-file-input>
        </v-col>
      </v-row>
    </v-container>

    <v-card-actions class="px-6">
      <v-container class="px-0">
        <v-row dense>
          <v-col md="2" sm="3" cols="6">
            <v-btn color="primary" block @click.stop="save" :disabled="!saveEnabled">{{ $t('buttons.save') }}</v-btn>
          </v-col>
          <v-col md="2" sm="3" cols="6">
            <v-btn color="primary" outlined block @click="$emit('close')">{{ $t('buttons.cancel') }}</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>
  </v-form>
  </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ProjectEdit',
  props: ['projectId', 'visible'],
  data: () => ({
    name: null,
    logo: null,
    uploadFile: false,
    fileToUpload: null,
    saveEnabled: false
  }),
  methods: {
    validate (ref) {
      this.$refs[ref].validate()
    },
    checkRequired (value) {
      if (value === null || value.length === 0 || ((typeof value === 'string' || value instanceof String) && value.trim().length === 0)) {
        return ' is required'
      } else {
        return true
      }
    },
    upload () {
      let self = this
      this.$store.dispatch('uploadProjectLogo', {
        file: self.fileToUpload,
        projectId: self.projectId
      }).done((response) => {
        self.uploadFile = false
        self.logo = response.url
      }).fail(err => {
        self.uploadFile = false
        console.log('Image upload failed')
        console.log(err)
      })
    },
    save () {
      this.saveEnabled = false
      let saveRequest = {
        logo: this.logo,
        name: this.name,
        id: this.projectId
      }
      this.$store.dispatch('saveProject', saveRequest).then(response => {
        this.$emit('projectWasSaved')
        this.$emit('close')
      })
    }
  },
  watch: {
    projectId: {
      handler: function (idValue) {
        let self = this
        if (idValue) {
          this.$store.dispatch('getProjectById', idValue).then(response => {
            self.name = response.name
            self.logo = response.logo
            self.saveEnabled = true
          })
        } else if (idValue === null) {
          this.name = null
          this.logo = null
          this.saveEnabled = true
        }
      }
    }
  }
}
</script>
