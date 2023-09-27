import ArtworkDate from './ArtworkDate'

describe('value object ArtworkDate', () => {
  let artworkDate: ArtworkDate = new ArtworkDate()

  it('should set createdAt to current date by default', () => {
    expect(artworkDate.createdAt).toBeInstanceOf(Date)
  })

  it('should set updatedAt to current date by default', () => {
      expect(artworkDate.updatedAt).toBeInstanceOf(Date)
  })

  it('should set createdAt to provided date', () => {
    let createdAt = new Date('2023-01-01')
    let artworkDate = new ArtworkDate(createdAt)

    expect(artworkDate.createdAt).toEqual(createdAt)
  })

  it('should set updatedAt to provided date', () => {
    let updatedAt = new Date('2023-01-01')
    let artworkDate = new ArtworkDate(undefined, updatedAt)
    
    expect(artworkDate.updatedAt).toEqual(updatedAt)
  })

  it('should update updatedAt', () => {
    let previousDate = artworkDate.updatedAt

    artworkDate.updated()

    expect(artworkDate.updatedAt).not.toEqual(previousDate)
  })
})