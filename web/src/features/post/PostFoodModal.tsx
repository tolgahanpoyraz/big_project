import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Modal } from '../../components/Modal';
import { Icon } from '../../components/Icon';
import { PlacePicker } from './PlacePicker';
import { POST_TYPES, DIETARY_TAGS } from '../../lib/content';
import { haversineMiles, type Coords } from '../../lib/geo';
import { toJpegBlob } from '../../lib/imageConvert';
import { ApiError } from '../../api/client';
import type { CampusLocation, CreatePostRequest, DietaryTag, Post, PostType } from '../../api/types';

interface PostFoodModalProps {
  locations: CampusLocation[];
  userCoords: Coords | null;
  onClose: () => void;
  onCreate: (data: CreatePostRequest, image: Blob | null) => Promise<Post>;
  onCreated: (post: Post) => void;
  onError: (msg: string) => void;
  onNotice: (msg: string) => void;
}

export function PostFoodModal({ locations, userCoords, onClose, onCreate, onCreated, onError, onNotice }: PostFoodModalProps) {
  const [foodName, setFoodName] = useState('');
  const [type, setType] = useState<PostType | null>(null);
  const [dietary, setDietary] = useState<DietaryTag[]>([]);
  const [locationId, setLocationId] = useState<string | null>(null);
  const [room, setRoom] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Three nearest known places, to surface as quick-pick suggestions.
  const nearest = useMemo(() => {
    if (!userCoords || locations.length === 0) return [];
    return [...locations]
      .map((l) => ({ l, d: haversineMiles(userCoords, l) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 3)
      .map((x) => x.l);
  }, [userCoords, locations]);

  function toggleDiet(tag: DietaryTag) {
    setDietary((d) => (d.includes(tag) ? d.filter((t) => t !== tag) : [...d, tag]));
  }

  function onPickImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError(null);
    if (!foodName.trim()) return setError('Give it a name so people know what it is.');
    if (!type) return setError('Pick a food type.');
    if (!locationId) return setError('Choose where the food is.');

    const req: CreatePostRequest = {
      foodName: foodName.trim(),
      type,
      dietaryTags: dietary,
      location: locationId,
      locationDetail: room.trim() || undefined,
    };

    setBusy(true);
    try {
      const blob = image ? await toJpegBlob(image) : null;
      const post = await onCreate(req, blob);
      onCreated(post);
      onClose();
    } catch (err) {
      // If image uploads aren't configured server-side, still post (without photo).
      if (image && err instanceof ApiError && err.status === 503) {
        try {
          const post = await onCreate(req, null);
          onNotice('Posted without a photo — image uploads aren’t set up yet.');
          onCreated(post);
          onClose();
          return;
        } catch (err2) {
          setError(err2 instanceof Error ? err2.message : 'Could not post');
        }
      } else {
        const msg = err instanceof Error ? err.message : 'Could not post';
        setError(msg);
        onError(msg);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal onClose={onClose} className="post-modal" labelledBy="post-modal-title">
      <div className="post-photo-side">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          style={{
            width: '100%',
            flex: 1,
            minHeight: 300,
            borderRadius: 18,
            border: preview ? 'none' : '2px dashed #f0c8b6',
            background: preview ? 'transparent' : '#fff',
            color: 'var(--text-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            padding: 0,
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          {preview ? (
            <img src={preview} alt="Selected food" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <Icon name="camera" size={30} stroke="#e79b86" strokeWidth={1.8} />
              Add a photo of the food
            </span>
          )}
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={onPickImage} style={{ display: 'none' }} />
        <div className="post-photo-hint">A clear photo gets 3× more "still here" votes.</div>
      </div>

      <form className="post-form-side cw-scroll" onSubmit={submit}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div className="modal-title" id="post-modal-title">
              Drop free food
            </div>
            <div className="modal-sub">Post it the second you see it.</div>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="x" size={16} strokeWidth={2.3} />
          </button>
        </div>

        <div className="field-label" style={{ marginTop: 22 }}>
          What is it?
        </div>
        <div className="field field-sm">
          <input
            type="text"
            placeholder="e.g. Leftover pizza — 6 boxes"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            maxLength={120}
          />
        </div>

        <div className="field-label" style={{ marginTop: 16 }}>
          Type
        </div>
        <div className="chip-row">
          {POST_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              className={`pick ${type === t.value ? 'active' : ''}`}
              onClick={() => setType(t.value)}
            >
              {t.emoji ? `${t.emoji} ${t.label}` : t.label}
            </button>
          ))}
        </div>

        <div className="field-label" style={{ marginTop: 16 }}>
          Dietary <span className="muted">· optional, tap all that apply</span>
        </div>
        <div className="chip-row">
          {DIETARY_TAGS.map((t) => {
            const on = dietary.includes(t.value);
            return (
              <button
                key={t.value}
                type="button"
                className={`pick ${on ? 'active-green' : ''}`}
                onClick={() => toggleDiet(t.value)}
              >
                {on && <Icon name="check" size={13} stroke="#fff" strokeWidth={2.6} />}
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="field-label" style={{ marginTop: 16 }}>
          Where?
        </div>
        <PlacePicker locations={locations} value={locationId} onChange={setLocationId} />

        {nearest.length > 0 && (
          <div className="suggest-row">
            <span className="suggest-label">
              <Icon name="gps" size={13} stroke="#b98a7a" strokeWidth={2} />
              Nearest you
            </span>
            {nearest.map((l) => (
              <button
                key={l.id}
                type="button"
                className={`suggest ${locationId === l.id ? 'active' : ''}`}
                onClick={() => setLocationId(l.id)}
              >
                {l.name}
              </button>
            ))}
          </div>
        )}

        <div className="field field-sm" style={{ marginTop: 9 }}>
          <span className="field-icon">
            <Icon name="room" size={17} strokeWidth={2} />
          </span>
          <input
            type="text"
            placeholder="Room or spot (optional)"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            maxLength={256}
          />
        </div>

        <div className="banner-warn" style={{ marginTop: 16 }}>
          <Icon name="clock" size={18} strokeWidth={2} />
          <div className="flex-1">
            <div className="b-title">Expires in ~50 min</div>
            <div className="b-body">Every "still here" vote keeps it alive longer; goes sooner if voted gone.</div>
          </div>
        </div>

        {error && (
          <div className="form-error">
            <Icon name="info" size={16} strokeWidth={2} />
            {error}
          </div>
        )}

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary btn-md" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-md" disabled={busy}>
            {busy ? (
              <span className="spinner" />
            ) : (
              <>
                <Icon name="crumb" size={18} stroke="#fff" strokeWidth={1.9} />
                Post free food
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
