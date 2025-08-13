import React, { useEffect, useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
  CFormCheck,
  CSpinner,
  CImage,
} from '@coreui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAxios, getBaseURL, getHeaders } from '../../../api/config';
import CustomToast from '../../../components/CustomToast/CustomToast';
import { MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_SIZE_MB } from '../../../utils/constants';

const CTAManagement = () => {
  const [formData, setFormData] = useState({
    slug: [],
    title: '',
    description: '',
    link1: '',
    link2: '',
    image: '',
    imageFile: null,
  });

  const [buttonLoading, setButtonLoading] = useState(false);
  const [toastFlag, setToastFlag] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const itemId = location.state?.id || null;

  useEffect(() => {
    if (itemId) {
      const fetchItem = async () => {
        const url = `${getBaseURL()}/cms/cta/${itemId}`
        const token = getHeaders().token
        try {
          const response = await getAxios().get(url, {
            headers: { Authorization: `Bearer ${token}` },
          })
          setFormData({
            slug: response?.data?.slug || [],
            title: response?.data?.title || '',
            description: response?.data?.description || '',
            link1: response?.data?.link1 || '',
            link2: response?.data?.link2 || '',
            image: response?.data?.image || '',
            imageFile: null,
          })
        } catch (error) {
          setToastFlag(true)
          setToastMessage("Error fetching details")
          setToastColor("danger")
          setTimeout(() => setToastFlag(false), 2000)
        }
      }
      fetchItem()
    }
  }, [itemId])

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let updatedSlugs = [...formData.slug];

    if (checked) {
      updatedSlugs.push(value);
    } else {
      updatedSlugs = updatedSlugs.filter((slug) => slug !== value);
    }

    setFormData({ ...formData, slug: updatedSlugs });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setFormData((prev) => ({ ...prev, imageFile: file }));

      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData((prev) => ({ ...prev, image: ev.target.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonLoading(true);
    const token = getHeaders().token;

    if (
      formData.slug.length === 0 ||
      !formData.title ||
      !formData.description ||
      !formData.link1 ||
      !formData.link2 ||
      (!formData.image && !formData.imageFile)
    ) {
      setToastFlag(true);
      setToastMessage('Please fill all fields and upload an image');
      setToastColor('warning');
      setTimeout(() => setToastFlag(false), 2000);
      setButtonLoading(false);
      return;
    }

    if (formData.imageFile && formData.imageFile.size > MAX_IMAGE_SIZE_BYTES) {
      setToastFlag(true);
      setToastMessage(`Image size should not exceed ${MAX_IMAGE_SIZE_MB} MB`);
      setToastColor('warning');
      setTimeout(() => setToastFlag(false), 2500);
      setButtonLoading(false);
      return;
    }

    try {
      const url = itemId
        ? `${getBaseURL()}/cms/cta/${itemId}`
        : `${getBaseURL()}/cms/cta`;
      const method = itemId ? 'put' : 'post';
      const fd = new FormData();

      fd.append('title', formData.title);
      fd.append('description', formData.description);
      fd.append('link1', formData.link1);
      fd.append('link2', formData.link2);
      formData.slug.forEach((slugValue) => fd.append('slug[]', slugValue));
      if (formData.imageFile) {
        fd.append('image', formData.imageFile);
      }

      const response = await getAxios()[method](url, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.status === 201) {
        setToastFlag(true);
        setToastMessage(itemId ? 'CTA Updated Successfully' : 'CTA Submitted Successfully');
        setToastColor('success');
        setFormData({
          slug: [],
          title: '',
          description: '',
          link1: '',
          link2: '',
          image: '',
          imageFile: null,
        });
        navigate('/cta')
      } else {
        throw new Error('Unexpected response');
      }
    } catch (error) {
      setToastFlag(true);
      setToastMessage(error?.response?.data?.message || error?.message || 'Error saving CTA');
      setToastColor('danger');
    }

    setTimeout(() => setToastFlag(false), 2000);
    setButtonLoading(false);
  };

  return (
    <>
      <CustomToast
        message={toastMessage}
        show={toastFlag}
        onClose={() => setToastFlag(false)}
        color={toastColor}
      />
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>CTA Section Management</strong>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleSubmit}>
                <div className="mb-3">
                  <CFormLabel>Select Pages</CFormLabel>
                  <div className="d-flex flex-wrap gap-3">
                    {['home', 'for business', 'course details'].map((slug) => (
                      <CFormCheck
                        key={slug}
                        type="checkbox"
                        id={`slug-${slug}`}
                        label={slug.charAt(0).toUpperCase() + slug.slice(1)}
                        value={slug}
                        checked={formData.slug.includes(slug)}
                        onChange={handleCheckboxChange}
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="title">Title</CFormLabel>
                  <CFormInput
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter CTA title"
                  />
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="description">Description</CFormLabel>
                  <CFormTextarea
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter CTA description"
                  />
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="link1">Link 1</CFormLabel>
                  <CFormInput
                    type="text"
                    name="link1"
                    value={formData.link1}
                    onChange={handleChange}
                    placeholder="Enter first link"
                  />
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="link2">Link 2</CFormLabel>
                  <CFormInput
                    type="text"
                    name="link2"
                    value={formData.link2}
                    onChange={handleChange}
                    placeholder="Enter second link"
                  />
                </div>

                <div className="mb-3">
                  <CFormLabel className="fw-bold fs-7">Image</CFormLabel>
                  <CFormInput
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={handleChange}
                  />
                  {formData.image && (
                    <CImage
                      src={formData.image}
                      alt="Preview"
                      style={{ width: "200px", height: "200px", marginTop: "10px", objectFit: "cover" }}
                    />
                  )}
                </div>

                <CButton
                  color="primary"
                  type="submit"
                  disabled={buttonLoading}
                >
                  {buttonLoading ? <CSpinner size="sm" /> : itemId ? "Update" : "Submit"}
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default CTAManagement;
