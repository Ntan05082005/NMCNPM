import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import { createProblem, updateProblem, getTestCases, getProblemById } from '../../API/api-admin';
import './problemEditor.css';

export default function ProblemEditor() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        difficulty: 'EASY',
        description: '',
        constraints: '',
        timeLimitMs: 2000,
        memoryLimitMb: 256,
        functionName: '',
        starterCodeCpp: '',
        starterCodePython: '',
        starterCodeJavascript: '',
        driverCodeCpp: '',
        driverCodePython: '',
        driverCodeJavascript: '',
        example1Input: '',
        example1Output: '',
        example1Explanation: '',
        example2Input: '',
        example2Output: '',
        example2Explanation: '',
        summary: '',
        learningObjectives: ''
    });

    const [testCases, setTestCases] = useState([
        { input: '', expectedOutput: '', isSample: true }
    ]);

    const [activeCodeTab, setActiveCodeTab] = useState('cpp');

    useEffect(() => {
        if (isEditMode) {
            loadProblem();
        }
    }, [id]);

    const loadProblem = async () => {
        setLoading(true);
        try {
            // Load problem details
            const problemRes = await getProblemById(id);
            const problem = problemRes.data;
            
            // Populate form data with problem details
            setFormData({
                title: problem.title || '',
                difficulty: problem.difficulty || 'EASY',
                description: problem.description || '',
                constraints: problem.constraints || '',
                timeLimitMs: problem.timeLimitMs || 2000,
                memoryLimitMb: problem.memoryLimitMb || 256,
                functionName: problem.functionName || '',
                starterCodeCpp: problem.starterCodeCpp || '',
                starterCodePython: problem.starterCodePython || '',
                starterCodeJavascript: problem.starterCodeJavascript || '',
                driverCodeCpp: problem.driverCodeCpp || '',
                driverCodePython: problem.driverCodePython || '',
                driverCodeJavascript: problem.driverCodeJavascript || '',
                example1Input: problem.example1Input || '',
                example1Output: problem.example1Output || '',
                example1Explanation: problem.example1Explanation || '',
                example2Input: problem.example2Input || '',
                example2Output: problem.example2Output || '',
                example2Explanation: problem.example2Explanation || '',
                summary: problem.summary || '',
                learningObjectives: problem.learningObjectives || ''
            });

            // Load test cases
            const tcRes = await getTestCases(id);
            setTestCases(tcRes.data.length > 0 ? tcRes.data.map(tc => ({
                input: tc.input,
                expectedOutput: tc.expectedOutput,
                isSample: tc.isSample
            })) : [{ input: '', expectedOutput: '', isSample: true }]);
        } catch (err) {
            console.error('Failed to load problem:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addTestCase = () => {
        setTestCases([...testCases, { input: '', expectedOutput: '', isSample: false }]);
    };

    const updateTestCase = (index, field, value) => {
        const updated = [...testCases];
        updated[index][field] = value;
        setTestCases(updated);
    };

    const removeTestCase = (index) => {
        if (testCases.length > 1) {
            setTestCases(testCases.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = {
                ...formData,
                testCases: testCases.filter(tc => tc.input && tc.expectedOutput)
            };

            if (isEditMode) {
                await updateProblem(id, payload);
                alert('Problem updated successfully!');
            } else {
                await createProblem(payload);
                alert('Problem created successfully!');
            }
            navigate('/admin');
        } catch (err) {
            console.error('Failed to save problem:', err);
            alert('Failed to save problem: ' + (err.response?.data?.error || err.message));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="problem-editor-loading">Loading...</div>;
    }

    return (
        <div className="problem-editor-page">
            <div className="editor-container">
                {/* Header */}
                <header className="editor-header">
                    <button className="btn-back" onClick={() => navigate('/admin')}>
                        <FiArrowLeft /> Back to Admin
                    </button>
                    <h1>{isEditMode ? 'Edit Problem' : 'Create New Problem'}</h1>
                    <button
                        className="btn-save"
                        onClick={handleSubmit}
                        disabled={saving}
                    >
                        <FiSave /> {saving ? 'Saving...' : 'Save Problem'}
                    </button>
                </header>

                <form className="editor-form" onSubmit={handleSubmit}>
                    {/* Basic Info */}
                    <section className="form-section">
                        <h2>Basic Information</h2>
                        <div className="form-row">
                            <div className="form-group flex-2">
                                <label>Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    placeholder="e.g., Two Sum"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Difficulty *</label>
                                <select
                                    value={formData.difficulty}
                                    onChange={(e) => handleChange('difficulty', e.target.value)}
                                >
                                    <option value="EASY">Easy</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HARD">Hard</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Time Limit (ms)</label>
                                <input
                                    type="number"
                                    value={formData.timeLimitMs}
                                    onChange={(e) => handleChange('timeLimitMs', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="form-group">
                                <label>Memory Limit (MB)</label>
                                <input
                                    type="number"
                                    value={formData.memoryLimitMb}
                                    onChange={(e) => handleChange('memoryLimitMb', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="form-group">
                                <label>Function Name</label>
                                <input
                                    type="text"
                                    value={formData.functionName}
                                    onChange={(e) => handleChange('functionName', e.target.value)}
                                    placeholder="e.g., twoSum"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Description */}
                    <section className="form-section">
                        <h2>Problem Description *</h2>
                        <div className="form-group">
                            <textarea
                                className="description-textarea"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Describe the problem... (HTML supported)"
                                rows={10}
                            />
                        </div>
                    </section>

                    {/* Examples */}
                    <section className="form-section">
                        <h2>Examples</h2>
                        <div className="examples-grid">
                            <div className="example-box">
                                <h3>Example 1</h3>
                                <div className="form-group">
                                    <label>Input</label>
                                    <textarea
                                        value={formData.example1Input}
                                        onChange={(e) => handleChange('example1Input', e.target.value)}
                                        placeholder="nums = [2,7,11,15], target = 9"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Output</label>
                                    <textarea
                                        value={formData.example1Output}
                                        onChange={(e) => handleChange('example1Output', e.target.value)}
                                        placeholder="[0,1]"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Explanation</label>
                                    <textarea
                                        value={formData.example1Explanation}
                                        onChange={(e) => handleChange('example1Explanation', e.target.value)}
                                        placeholder="Because nums[0] + nums[1] == 9..."
                                    />
                                </div>
                            </div>
                            <div className="example-box">
                                <h3>Example 2</h3>
                                <div className="form-group">
                                    <label>Input</label>
                                    <textarea
                                        value={formData.example2Input}
                                        onChange={(e) => handleChange('example2Input', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Output</label>
                                    <textarea
                                        value={formData.example2Output}
                                        onChange={(e) => handleChange('example2Output', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Explanation</label>
                                    <textarea
                                        value={formData.example2Explanation}
                                        onChange={(e) => handleChange('example2Explanation', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Constraints */}
                    <section className="form-section">
                        <h2>Constraints</h2>
                        <div className="form-group">
                            <textarea
                                value={formData.constraints}
                                onChange={(e) => handleChange('constraints', e.target.value)}
                                placeholder="• 2 <= nums.length <= 10^4&#10;• -10^9 <= nums[i] <= 10^9"
                                rows={4}
                            />
                        </div>
                    </section>

                    {/* Starter Code */}
                    <section className="form-section">
                        <h2>Starter Code Templates</h2>
                        <div className="code-tabs">
                            <button
                                type="button"
                                className={activeCodeTab === 'cpp' ? 'active' : ''}
                                onClick={() => setActiveCodeTab('cpp')}
                            >C++</button>
                            <button
                                type="button"
                                className={activeCodeTab === 'python' ? 'active' : ''}
                                onClick={() => setActiveCodeTab('python')}
                            >Python</button>
                            <button
                                type="button"
                                className={activeCodeTab === 'javascript' ? 'active' : ''}
                                onClick={() => setActiveCodeTab('javascript')}
                            >JavaScript</button>
                        </div>

                        {activeCodeTab === 'cpp' && (
                            <>
                                <div className="form-group">
                                    <label>Starter Code (C++)</label>
                                    <textarea
                                        className="code-textarea"
                                        value={formData.starterCodeCpp}
                                        onChange={(e) => handleChange('starterCodeCpp', e.target.value)}
                                        placeholder="class Solution {&#10;public:&#10;    vector<int> twoSum(vector<int>& nums, int target) {&#10;        &#10;    }&#10;};"
                                        rows={8}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Driver Code (C++) - Wraps user solution</label>
                                    <textarea
                                        className="code-textarea"
                                        value={formData.driverCodeCpp}
                                        onChange={(e) => handleChange('driverCodeCpp', e.target.value)}
                                        placeholder="// Code that parses input and calls user's function"
                                        rows={8}
                                    />
                                </div>
                            </>
                        )}

                        {activeCodeTab === 'python' && (
                            <>
                                <div className="form-group">
                                    <label>Starter Code (Python)</label>
                                    <textarea
                                        className="code-textarea"
                                        value={formData.starterCodePython}
                                        onChange={(e) => handleChange('starterCodePython', e.target.value)}
                                        placeholder="class Solution:&#10;    def twoSum(self, nums: List[int], target: int) -> List[int]:&#10;        pass"
                                        rows={8}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Driver Code (Python)</label>
                                    <textarea
                                        className="code-textarea"
                                        value={formData.driverCodePython}
                                        onChange={(e) => handleChange('driverCodePython', e.target.value)}
                                        rows={8}
                                    />
                                </div>
                            </>
                        )}

                        {activeCodeTab === 'javascript' && (
                            <>
                                <div className="form-group">
                                    <label>Starter Code (JavaScript)</label>
                                    <textarea
                                        className="code-textarea"
                                        value={formData.starterCodeJavascript}
                                        onChange={(e) => handleChange('starterCodeJavascript', e.target.value)}
                                        placeholder="/**&#10; * @param {number[]} nums&#10; * @param {number} target&#10; * @return {number[]}&#10; */&#10;var twoSum = function(nums, target) {&#10;    &#10;};"
                                        rows={8}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Driver Code (JavaScript)</label>
                                    <textarea
                                        className="code-textarea"
                                        value={formData.driverCodeJavascript}
                                        onChange={(e) => handleChange('driverCodeJavascript', e.target.value)}
                                        rows={8}
                                    />
                                </div>
                            </>
                        )}
                    </section>

                    {/* Test Cases */}
                    <section className="form-section">
                        <div className="section-header">
                            <h2>Test Cases</h2>
                            <button type="button" className="btn-add" onClick={addTestCase}>
                                <FiPlus /> Add Test Case
                            </button>
                        </div>

                        <div className="test-cases-list">
                            {testCases.map((tc, index) => (
                                <div key={index} className="test-case-item">
                                    <div className="test-case-header">
                                        <span>Test Case #{index + 1}</span>
                                        <div className="test-case-actions">
                                            <label className="sample-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={tc.isSample}
                                                    onChange={(e) => updateTestCase(index, 'isSample', e.target.checked)}
                                                />
                                                Sample (visible to users)
                                            </label>
                                            <button
                                                type="button"
                                                className="btn-remove"
                                                onClick={() => removeTestCase(index)}
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="test-case-content">
                                        <div className="form-group">
                                            <label>Input</label>
                                            <textarea
                                                value={tc.input}
                                                onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                                                placeholder="2 7 11 15&#10;9"
                                                rows={3}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Expected Output</label>
                                            <textarea
                                                value={tc.expectedOutput}
                                                onChange={(e) => updateTestCase(index, 'expectedOutput', e.target.value)}
                                                placeholder="0 1"
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Summary & Learning Objectives */}
                    <section className="form-section">
                        <h2>Additional Info</h2>
                        <div className="form-group">
                            <label>Summary</label>
                            <textarea
                                value={formData.summary}
                                onChange={(e) => handleChange('summary', e.target.value)}
                                placeholder="Brief summary of the problem..."
                                rows={3}
                            />
                        </div>
                        <div className="form-group">
                            <label>Learning Objectives</label>
                            <textarea
                                value={formData.learningObjectives}
                                onChange={(e) => handleChange('learningObjectives', e.target.value)}
                                placeholder="What will users learn from this problem?"
                                rows={3}
                            />
                        </div>
                    </section>

                    {/* Submit Button */}
                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={() => navigate('/admin')}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit" disabled={saving}>
                            <FiSave /> {saving ? 'Saving...' : (isEditMode ? 'Update Problem' : 'Create Problem')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
