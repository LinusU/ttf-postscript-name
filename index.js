import toDataView from 'to-data-view'

const TABLE_COUNT_OFFSET = 4
const TABLE_HEAD_OFFSET = 12
const TABLE_HEAD_SIZE = 16
const TAG_OFFSET = 0
const TAG_SIZE = 4
const CHECKSUM_OFFSET = TAG_OFFSET + TAG_SIZE
const CHECKSUM_SIZE = 4
const CONTENTS_PTR_OFFSET = CHECKSUM_OFFSET + CHECKSUM_SIZE
const CONTENTS_PTR_SIZE = 4

function nameTableHead (data) {
  const decoder = new TextDecoder('utf-8')
  const numTables = data.getUint16(TABLE_COUNT_OFFSET)

  for (let i = 0; i < numTables; ++i) {
    const offset = TABLE_HEAD_OFFSET + i * TABLE_HEAD_SIZE
    const tag = new Uint8Array(data.buffer, data.byteOffset + offset, CONTENTS_PTR_SIZE)

    if (decoder.decode(tag) === 'name') {
      return data.getUint32(offset + CONTENTS_PTR_OFFSET)
    }
  }
}

export default function ttfPostscriptName (input) {
  const data = toDataView(input)

  const ntOffset = nameTableHead(data)

  const offsetStorage = data.getUint16(ntOffset + 4)
  const numberNameRecords = data.getUint16(ntOffset + 2)

  const storage = offsetStorage + ntOffset

  for (let j = 0; j < numberNameRecords; j++) {
    const offset = ntOffset + 6 + (j * 12)
    const nameId = data.getUint16(offset + 6)

    if (nameId === 6) {
      let name = ''

      const stringLength = data.getUint16(offset + 8)
      const stringOffset = data.getUint16(offset + 10)

      for (let k = 0; k < stringLength; k++) {
        const charCode = data.getUint8(storage + stringOffset + k)
        if (charCode === 0) continue
        name += String.fromCharCode(charCode)
      }

      return name
    }
  }

  throw new Error('Postscript name not found')
}
