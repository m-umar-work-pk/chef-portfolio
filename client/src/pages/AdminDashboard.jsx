import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaPlus, FaEdit, FaTrash, FaSignOutAlt,
  FaUtensils, FaImage, FaEye, FaStar, FaBriefcase,
} from 'react-icons/fa';

const Categories = ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Special'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  const [activeTab, setActiveTab] = useState('dishes');
  const [dishes, setDishes] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [dishName, setDishName] = useState('');
  const [dishDescription, setDishDescription] = useState('');
  const [dishCategory, setDishCategory] = useState('Main Course');
  const [dishFeatured, setDishFeatured] = useState(false);
  const [dishIngredients, setDishIngredients] = useState('');
  const [dishRecipe, setDishRecipe] = useState('');
  const [dishCookTime, setDishCookTime] = useState('');
  const [dishServings, setDishServings] = useState('');
  const [dishDifficulty, setDishDifficulty] = useState('Medium');
  const [dishCalories, setDishCalories] = useState('');
  const [dishChefNotes, setDishChefNotes] = useState('');
  const [dishAvailable, setDishAvailable] = useState(true);
  const [dishImageFile, setDishImageFile] = useState(null);
  const [dishImagePreview, setDishImagePreview] = useState('');

  const [skillName, setSkillName] = useState('');
  const [skillEmoji, setSkillEmoji] = useState('');
  const [skillLevel, setSkillLevel] = useState(50);
  const [skillImageFile, setSkillImageFile] = useState(null);
  const [skillImagePreview, setSkillImagePreview] = useState('');

  const [expYear, setExpYear] = useState('');
  const [expTitle, setExpTitle] = useState('');
  const [expDescription, setExpDescription] = useState('');

  useEffect(() => {
    if (!token) navigate('/admin');
    else fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [dRes, sRes, eRes] = await Promise.all([
        fetch('/api/dishes'),
        fetch('/api/skills'),
        fetch('/api/experience'),
      ]);
      if (dRes.ok) { const d = await dRes.json(); setDishes(d.data || []); }
      if (sRes.ok) { const s = await sRes.json(); setSkills(s.data || []); }
      if (eRes.ok) { const e = await eRes.json(); setExperiences(e.data || []); }
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin');
  };

  const resetDishForm = () => {
    setDishName('');
    setDishDescription('');
    setDishCategory('Main Course');
    setDishFeatured(false);
    setDishIngredients('');
    setDishRecipe('');
    setDishCookTime('');
    setDishServings('');
    setDishDifficulty('Medium');
    setDishCalories('');
    setDishChefNotes('');
    setDishAvailable(true);
    setDishImageFile(null);
    setDishImagePreview('');
  };

  const resetSkillForm = () => {
    setSkillName('');
    setSkillEmoji('');
    setSkillLevel(50);
    setSkillImageFile(null);
    setSkillImagePreview('');
  };

  const resetExpForm = () => {
    setExpYear('');
    setExpTitle('');
    setExpDescription('');
  };

  const resetAllForms = () => {
    resetDishForm();
    resetSkillForm();
    resetExpForm();
    setEditing(null);
  };

  const openAddForm = () => { resetAllForms(); setShowForm(true); };

  const openEditDish = (dish) => {
    resetAllForms(); setEditing(dish);
    setDishName(dish.name); setDishDescription(dish.description);
    setDishCategory(dish.category); setDishFeatured(dish.featured);
    setDishIngredients(dish.ingredients ? dish.ingredients.join(', ') : '');
    setDishRecipe(dish.recipe || '');
    setDishCookTime(dish.cookTime || '');
    setDishServings(dish.servings || '');
    setDishDifficulty(dish.difficulty || 'Medium');
    setDishCalories(dish.calories || '');
    setDishChefNotes(dish.chefNotes || '');
    setDishAvailable(dish.available); setDishImagePreview(dish.image || '');
    setShowForm(true);
  };

  const openEditSkill = (skill) => {
    resetAllForms(); setEditing(skill);
    setSkillName(skill.name); setSkillEmoji(skill.emoji);
    setSkillLevel(skill.level || 50);
    setSkillImagePreview(skill.image || '');
    setShowForm(true);
  };

  const openEditExp = (exp) => {
    resetAllForms(); setEditing(exp);
    setExpYear(String(exp.year)); setExpTitle(exp.title);
    setExpDescription(exp.description);
    setShowForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setDishImageFile(file); setDishImagePreview(URL.createObjectURL(file)); }
  };

  const handleSkillImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setSkillImageFile(file); setSkillImagePreview(URL.createObjectURL(file)); }
  };

  const handleDishSubmit = async (e) => {
    e.preventDefault(); setUploading(true);
    try {
      const formData = new FormData();
      formData.append('name', dishName);
      formData.append('description', dishDescription);
      formData.append('category', dishCategory);
      formData.append('featured', dishFeatured);
      formData.append('available', dishAvailable);
      formData.append('ingredients', JSON.stringify(dishIngredients.split(',').map(i => i.trim()).filter(Boolean)));
      formData.append('recipe', dishRecipe);
      formData.append('cookTime', dishCookTime);
      formData.append('servings', dishServings);
      formData.append('difficulty', dishDifficulty);
      formData.append('calories', dishCalories);
      formData.append('chefNotes', dishChefNotes);
      if (dishImageFile) formData.append('image', dishImageFile);
      const url = editing ? `/api/dishes/${editing._id}` : '/api/dishes';
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to save dish');
      toast.success(editing ? 'Dish updated!' : 'Dish created!');
      setShowForm(false); resetAllForms(); fetchAll();
    } catch (err) { toast.error(err.message || 'Something went wrong'); }
    finally { setUploading(false); }
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault(); setUploading(true);
    try {
      const formData = new FormData();
      formData.append('name', skillName);
      formData.append('emoji', skillEmoji);
      formData.append('level', skillLevel);
      if (skillImageFile) formData.append('image', skillImageFile);
      const url = editing ? `/api/skills/${editing._id}` : '/api/skills';
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to save skill');
      toast.success(editing ? 'Skill updated!' : 'Skill created!');
      setShowForm(false); resetAllForms(); fetchAll();
    } catch (err) { toast.error(err.message || 'Something went wrong'); }
    finally { setUploading(false); }
  };

  const handleExpSubmit = async (e) => {
    e.preventDefault(); setUploading(true);
    try {
      const body = { year: expYear, title: expTitle, description: expDescription };
      const url = editing ? `/api/experience/${editing._id}` : '/api/experience';
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to save experience');
      toast.success(editing ? 'Experience updated!' : 'Experience created!');
      setShowForm(false); resetAllForms(); fetchAll();
    } catch (err) { toast.error(err.message || 'Something went wrong'); }
    finally { setUploading(false); }
  };

  const handleDeleteDish = async (id) => {
    if (!window.confirm('Delete this dish?')) return;
    try {
      const res = await fetch(`/api/dishes/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed');
      toast.success('Dish deleted!'); fetchAll();
    } catch (err) { toast.error(err.message); }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      const res = await fetch(`/api/skills/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed');
      toast.success('Skill deleted!'); fetchAll();
    } catch (err) { toast.error(err.message); }
  };

  const handleDeleteExp = async (id) => {
    if (!window.confirm('Delete this experience?')) return;
    try {
      const res = await fetch(`/api/experience/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed');
      toast.success('Experience deleted!'); fetchAll();
    } catch (err) { toast.error(err.message); }
  };

  const tabs = [
    { key: 'dishes', label: 'Dishes', icon: FaUtensils },
    { key: 'skills', label: 'Skills', icon: FaStar },
    { key: 'experience', label: 'Experience', icon: FaBriefcase },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-[#D4AF37] text-xl font-heading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-200">
      <header className="bg-[#111118] border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-heading text-gradient font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors">
              <FaEye /> View Site
            </a>
            <button onClick={handleLogout} className="flex items-center gap-2 btn-outline px-4 py-2 rounded-lg">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card-dark rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                <FaUtensils className="text-[#D4AF37] text-xl" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Dishes</p>
                <p className="text-2xl font-bold text-white">{dishes.length}</p>
              </div>
            </div>
          </div>
          <div className="card-dark rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                <FaEye className="text-[#D4AF37] text-xl" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Featured</p>
                <p className="text-2xl font-bold text-white">{dishes.filter(d => d.featured).length}</p>
              </div>
            </div>
          </div>
          <div className="card-dark rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                <FaStar className="text-[#D4AF37] text-xl" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Skills</p>
                <p className="text-2xl font-bold text-white">{skills.length}</p>
              </div>
            </div>
          </div>
          <div className="card-dark rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                <FaBriefcase className="text-[#D4AF37] text-xl" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Experience</p>
                <p className="text-2xl font-bold text-white">{experiences.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center border-b border-gray-800 mb-6">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.key}
                onClick={() => { setActiveTab(tab.key); resetAllForms(); setShowForm(false); }}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.key ? 'text-[#D4AF37]' : 'text-gray-400 hover:text-gray-200'
                }`}>
                <Icon /> {tab.label}
                {activeTab === tab.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading text-white capitalize">{activeTab}</h2>
          <button onClick={openAddForm} className="btn-gold flex items-center gap-2 px-4 py-2 rounded-lg font-medium">
            <FaPlus /> Add {activeTab === 'dishes' ? 'Dish' : activeTab === 'skills' ? 'Skill' : 'Experience'}
          </button>
        </div>

        {activeTab === 'dishes' && (dishes.length === 0 ? (
          <div className="card-dark rounded-xl p-12 text-center">
            <FaUtensils className="text-4xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No dishes yet. Add your first dish!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dishes.map(dish => (
              <div key={dish._id} className="card-dark rounded-xl overflow-hidden">
                <div className="h-48 bg-[#1a1a24] relative">
                  {dish.image ? (
                    <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaImage className="text-4xl text-gray-600" />
                    </div>
                  )}
                  {dish.featured && <span className="absolute top-3 left-3 bg-[#D4AF37] text-black text-xs font-bold px-2 py-1 rounded">Featured</span>}
                  <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded ${dish.available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {dish.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-heading text-white font-semibold">{dish.name}</h3>
                    <span className="text-xs bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-1 rounded">{dish.category}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{dish.description}</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditDish(dish)} className="flex items-center gap-1 btn-outline px-3 py-1.5 rounded-lg text-sm">
                      <FaEdit /> Edit
                    </button>
                    <button onClick={() => handleDeleteDish(dish._id)} className="flex items-center gap-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg text-sm transition-colors">
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {activeTab === 'skills' && (skills.length === 0 ? (
          <div className="card-dark rounded-xl p-12 text-center">
            <FaStar className="text-4xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No skills yet. Add your first skill!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map(skill => (
              <div key={skill._id} className="card-dark rounded-xl overflow-hidden">
                <div className="h-40 bg-[#1a1a24] relative">
                  {skill.image ? (
                    <img src={skill.image} alt={skill.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl">{skill.emoji || '🛠️'}</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {!skill.image && <span className="text-xl">{skill.emoji}</span>}
                      <h3 className="text-lg font-heading text-white font-semibold">{skill.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditSkill(skill)} className="btn-outline p-2 rounded-lg text-sm"><FaEdit /></button>
                      <button onClick={() => handleDeleteSkill(skill._id)} className="bg-red-500/10 text-red-400 hover:bg-red-500/20 p-2 rounded-lg text-sm transition-colors"><FaTrash /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2.5 bg-[#1a1a24] rounded-full overflow-hidden">
                      <div className="h-full bg-[#D4AF37] rounded-full transition-all" style={{ width: `${skill.level || 0}%` }} />
                    </div>
                    <span className="text-sm text-[#D4AF37] font-medium">{skill.level || 0}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {activeTab === 'experience' && (experiences.length === 0 ? (
          <div className="card-dark rounded-xl p-12 text-center">
            <FaBriefcase className="text-4xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No experience yet. Add your first entry!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map(exp => (
              <div key={exp._id} className="card-dark rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded font-medium">{exp.year}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditExp(exp)} className="btn-outline p-2 rounded-lg text-sm"><FaEdit /></button>
                    <button onClick={() => handleDeleteExp(exp._id)} className="bg-red-500/10 text-red-400 hover:bg-red-500/20 p-2 rounded-lg text-sm transition-colors"><FaTrash /></button>
                  </div>
                </div>
                <h3 className="text-lg font-heading text-white font-semibold mb-2">{exp.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-3">{exp.description}</p>
              </div>
            ))}
          </div>
        ))}

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="card-dark rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                <h3 className="text-xl font-heading text-white font-semibold">
                  {editing ? 'Edit' : 'Add New'} {activeTab === 'dishes' ? 'Dish' : activeTab === 'skills' ? 'Skill' : 'Experience'}
                </h3>
                <button onClick={() => { setShowForm(false); resetAllForms(); }} className="text-gray-400 hover:text-white text-2xl">&times;</button>
              </div>

              {activeTab === 'dishes' && (
                <form onSubmit={handleDishSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Dish Name</label>
                    <input type="text" value={dishName} onChange={e => setDishName(e.target.value)} required
                      className="w-full bg-[#1a1a24] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                      placeholder="Enter dish name" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                    <textarea value={dishDescription} onChange={e => setDishDescription(e.target.value)} required rows={3}
                      className="w-full bg-[#1a1a24] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-[#D4AF37] focus:outline-none transition-colors resize-none"
                      placeholder="Describe the dish..." />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Category</label>
                    <select value={dishCategory} onChange={e => setDishCategory(e.target.value)}
                      className="w-full bg-[#1a1a24] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-[#D4AF37] focus:outline-none transition-colors">
                      {Categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Image</label>
                    <div className="flex items-center gap-4">
                      <label className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a24] border border-dashed border-gray-700 rounded-lg px-4 py-6 cursor-pointer hover:border-[#D4AF37] transition-colors">
                        <FaImage className="text-gray-500" />
                        <span className="text-gray-400 text-sm">{dishImageFile ? dishImageFile.name : 'Choose image'}</span>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                      {dishImagePreview && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={dishImagePreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Ingredients (comma separated)</label>
                    <input type="text" value={dishIngredients} onChange={e => setDishIngredients(e.target.value)}
                      className="w-full bg-[#1a1a24] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                      placeholder="e.g. Chicken, Garlic, Olive Oil" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Recipe</label>
                    <textarea value={dishRecipe} onChange={e => setDishRecipe(e.target.value)} rows={5}
                      className="w-full bg-[#1a1a24] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-[#D4AF37] focus:outline-none transition-colors resize-none"
                      placeholder="Write the recipe steps here..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Cooking Time</label>
                      <input type="text" value={dishCookTime} onChange={e => setDishCookTime(e.target.value)}
                        className="w-full bg-[#1a1a24] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                        placeholder="e.g. 30 mins" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Servings</label>
                      <input type="text" value={dishServings} onChange={e => setDishServings(e.target.value)}
                        className="w-full bg-[#1a1a24] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                        placeholder="e.g. 4 servings" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Difficulty</label>
                      <select value={dishDifficulty} onChange={e => setDishDifficulty(e.target.value)}
                        className="w-full bg-[#1a1a24] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-[#D4AF37] focus:outline-none transition-colors">
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Calories</label>
                      <input type="number" value={dishCalories} onChange={e => setDishCalories(e.target.value)}
                        className="w-full bg-[#1a1a24] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                        placeholder="e.g. 450" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Chef&apos;s Notes</label>
                    <textarea value={dishChefNotes} onChange={e => setDishChefNotes(e.target.value)} rows={3}
                      className="w-full bg-[#1a1a24] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-[#D4AF37] focus:outline-none transition-colors resize-none"
                      placeholder="Chef's tips or special notes about this dish..." />
                  </div>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={dishFeatured} onChange={e => setDishFeatured(e.target.checked)} className="w-4 h-4 accent-[#D4AF37] rounded" />
                      <span className="text-sm text-gray-300">Featured</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={dishAvailable} onChange={e => setDishAvailable(e.target.checked)} className="w-4 h-4 accent-[#D4AF37] rounded" />
                      <span className="text-sm text-gray-300">Available</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button type="submit" disabled={uploading} className="btn-gold px-6 py-2.5 rounded-lg font-medium disabled:opacity-50">
                      {uploading ? 'Saving...' : editing ? 'Update Dish' : 'Create Dish'}
                    </button>
                    <button type="button" onClick={() => { setShowForm(false); resetAllForms(); }} className="btn-outline px-6 py-2.5 rounded-lg">Cancel</button>
                  </div>
                </form>
              )}

              {activeTab === 'skills' && (
                <form onSubmit={handleSkillSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Skill Name</label>
                    <input type="text" value={skillName} onChange={e => setSkillName(e.target.value)} required
                      className="w-full bg-[#1a1a24] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                      placeholder="e.g. JavaScript, React, Node.js" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Emoji</label>
                    <input type="text" value={skillEmoji} onChange={e => setSkillEmoji(e.target.value)} required
                      className="w-full bg-[#1a1a24] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                      placeholder="Enter an emoji character" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Image (optional)</label>
                    <div className="flex items-center gap-4">
                      <label className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a24] border border-dashed border-gray-700 rounded-lg px-4 py-6 cursor-pointer hover:border-[#D4AF37] transition-colors">
                        <FaImage className="text-gray-500" />
                        <span className="text-gray-400 text-sm">{skillImageFile ? skillImageFile.name : 'Choose image'}</span>
                        <input type="file" accept="image/*" onChange={handleSkillImageChange} className="hidden" />
                      </label>
                      {skillImagePreview && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={skillImagePreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Level: {skillLevel}%</label>
                    <input type="range" min="0" max="100" value={skillLevel} onChange={e => setSkillLevel(Number(e.target.value))}
                      className="w-full h-2.5 bg-[#1a1a24] rounded-full appearance-none cursor-pointer accent-[#D4AF37]" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span><span>50%</span><span>100%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button type="submit" disabled={uploading} className="btn-gold px-6 py-2.5 rounded-lg font-medium disabled:opacity-50">
                      {uploading ? 'Saving...' : editing ? 'Update Skill' : 'Create Skill'}
                    </button>
                    <button type="button" onClick={() => { setShowForm(false); resetAllForms(); }} className="btn-outline px-6 py-2.5 rounded-lg">Cancel</button>
                  </div>
                </form>
              )}

              {activeTab === 'experience' && (
                <form onSubmit={handleExpSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Year</label>
                    <input type="text" value={expYear} onChange={e => setExpYear(e.target.value)} required
                      className="w-full bg-[#1a1a24] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                      placeholder="e.g. 2023 or 2020-2023" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Title</label>
                    <input type="text" value={expTitle} onChange={e => setExpTitle(e.target.value)} required
                      className="w-full bg-[#1a1a24] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                      placeholder="e.g. Full Stack Developer" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                    <textarea value={expDescription} onChange={e => setExpDescription(e.target.value)} required rows={4}
                      className="w-full bg-[#1a1a24] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-[#D4AF37] focus:outline-none transition-colors resize-none"
                      placeholder="Describe your experience..." />
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button type="submit" disabled={uploading} className="btn-gold px-6 py-2.5 rounded-lg font-medium disabled:opacity-50">
                      {uploading ? 'Saving...' : editing ? 'Update Experience' : 'Create Experience'}
                    </button>
                    <button type="button" onClick={() => { setShowForm(false); resetAllForms(); }} className="btn-outline px-6 py-2.5 rounded-lg">Cancel</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
