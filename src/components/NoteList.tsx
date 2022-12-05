import { useMemo, useState } from "react"
import { Button, Col, Form, Modal, Row, Stack } from "react-bootstrap"
import { Link } from "react-router-dom"
import ReactSelect from "react-select"
import { Note, Tag } from "../App"
import NoteCard from "./NoteCard/NoteCard"

export type LiteNote = {
    id: string
    title: string
    tags: Tag[]
}

type NoteListProps = {
    availableTags: Tag[]
    notes: LiteNote[]
    onUpdateTag: (id: string, label: string) => void
    onDeleteTag: (id: string) => void
}

type EditTagsModagProps = {
    availableTags: Tag[]
    handleClose: () => void
    show: boolean
    onUpdateTag: (id: string, label: string) => void
    onDeleteTag: (id: string) => void
}


const NoteList = ({ availableTags, notes, onUpdateTag, onDeleteTag }: NoteListProps) => {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    console.log(selectedTags)
    const [title, setTitle] = useState('')
    const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false)

    function closeModal() {
        setEditTagsModalIsOpen(false)
    }

    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            return (title === '' || note.title.toLowerCase()
                .includes(title.toLowerCase())) && (availableTags.length === 0 || selectedTags
                    .every(tag => (
                        note.tags.some(noteTag => noteTag.id === tag.id)
                    )))
        })
    }, [title, selectedTags, notes])
    return (
        <>
            <Row className="align-item-center mb-4">
                <Col><h1>Notes</h1></Col>
                <Col xs='auto'>
                    <Stack gap={2} direction='horizontal' >
                        <Link to='/new'>
                            <Button variant="primary">Create</Button>
                        </Link>
                        <Button variant="outline-secondary" onClick={() => setEditTagsModalIsOpen(true)}>Edit Tags</Button>
                    </Stack>
                </Col>
            </Row>
            <Form>
                <Row className="mb-4">
                    <Col>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type='text' value={title} onChange={e => setTitle(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId='tags'>
                            <Form.Label>Tags</Form.Label>
                            <ReactSelect
                                value={selectedTags.map(tag => {
                                    return { label: tag.label, value: tag.id }
                                })}
                                options={availableTags.map(tag => {
                                    return { label: tag.label, value: tag.id }
                                })}
                                onChange={tags => setSelectedTags(tags.map(tag => {
                                    return { label: tag.label, id: tag.value }
                                }))}
                                isMulti />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            <Row xs={1} sm={2} lg={3} xl={4} className='g-3'>
                {filteredNotes.map(note => (
                    <Col key={note.id}>
                        <NoteCard id={note.id} title={note.title} tags={note.tags} />
                    </Col>
                ))}
            </Row>
            <EditTagsModal onUpdateTag={onUpdateTag} onDeleteTag={onDeleteTag} availableTags={availableTags} handleClose={closeModal} show={editTagsModalIsOpen} />
        </>
    )
}

export default NoteList


function EditTagsModal({ availableTags, handleClose, show, onUpdateTag, onDeleteTag }: EditTagsModagProps) {
    return <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Edit Tags</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Stack gap={2}>
                    {availableTags.map(tag => (
                        <Row key={tag.id}>
                            <Col>
                                <Form.Control type='text' value={tag.label} onChange={e => onUpdateTag(tag.id, e.target.value)}>
                                </Form.Control>
                            </Col>
                            <Col xs='auto'>
                                <Button variant='outline-danger' onClick={() => onDeleteTag(tag.id)}>&times;</Button>
                            </Col>
                        </Row>
                    ))}
                </Stack>
            </Form>
        </Modal.Body>
    </Modal>
}